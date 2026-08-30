<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Feature\FeaturePolicy;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Exception\NotFoundException;
use SohoPHP\SoFinder\Value\Theme;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;
use SohoPHP\SoFinder\Contract\CsrfTokenProviderInterface;
use SohoPHP\SoFinder\Contract\WorkspaceOptionProviderInterface;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;

final readonly class BrowserController
{
    public function __construct(
        private FileManager $files,
        private RouterInterface $router,
        private CsrfTokenProviderInterface $csrf,
        private string $assetVersion,
        private Theme $theme,
        /** @var array{mode:string,header:bool,logo:bool,search:bool,language_switcher:bool,view_switcher:bool,folder_tree:bool,scale:string,upload_conflict_strategy?:string,lowercase_upload_extensions?:bool} */
        private array $ui,
        private ?FeaturePolicy $features = null,
        private ?AuthorizationCheckerInterface $authorization = null,
        /** @var list<string> */ private array $securityStatusRoles = [],
        /** @var list<string> */ private array $pickerAllowedOrigins = [],
        private ?WorkspaceProvider $workspaces = null,
        private ?WorkspaceOptionProviderInterface $workspaceOptions = null,
        private ?BrowserPage $page = null,
        private bool $pickerLockResource = true,
    ) {
    }

    public function __invoke(Request $request): Response
    {
        if ($this->page !== null) {
            return new Response($this->page->render(SymfonyRequestContextProvider::fromRequest($request)), headers: [
                'Content-Type' => 'text/html; charset=UTF-8',
                'Cache-Control' => 'no-store, private',
                'X-Frame-Options' => 'SAMEORIGIN',
                'X-Content-Type-Options' => 'nosniff',
                'Referrer-Policy' => 'same-origin',
            ]);
        }
        $resources = $this->files->resources();
        $initialPath = $this->safePath($request->query->getString('path'));
        $pickerRequestId = $this->pickerRequestId($request->query->getString('pickerRequestId'));
        $language = strtolower((string) $request->query->get('lang', ''));
        if (!in_array($language, ['en', 'zh-cn', 'zh-tw'], true)) {
            $preferred = str_replace('_', '-', strtolower($request->getPreferredLanguage() ?? ''));
            $language = preg_match('/^zh-(tw|hk|mo)|^zh-hant/', $preferred) === 1
                ? 'zh-tw'
                : (str_starts_with($preferred, 'zh') ? 'zh-cn' : 'en');
        }
        $selectMode = $request->query->has('CKEditorFuncNum') || $request->query->getBoolean('select');
        $mode = $this->enumOverride($request, 'uiMode', ['auto', 'manager', 'picker'], (string) ($this->ui['mode'] ?? 'auto'));
        $resolvedMode = $mode === 'auto' ? ($selectMode ? 'picker' : 'manager') : $mode;
        $resource = (string) $request->query->get('type', '');
        $lockResource = $this->booleanOverride($request, 'resourceLock', $this->pickerLockResource);
        $pickerResource = $resolvedMode === 'picker' && $resource !== '' && $lockResource ? $resource : null;
        if ($pickerResource !== null && !in_array($pickerResource, array_column($resources, 'name'), true)) {
            throw new NotFoundException('The requested picker resource type does not exist or is not accessible.');
        }
        $ui = [
            'mode' => $resolvedMode,
            'header' => $this->booleanOverride($request, 'uiHeader', (bool) ($this->ui['header'] ?? true)),
            'logo' => $this->booleanOverride($request, 'uiLogo', (bool) ($this->ui['logo'] ?? true)),
            'search' => $this->booleanOverride($request, 'uiSearch', (bool) ($this->ui['search'] ?? true)),
            'languageSwitcher' => $this->booleanOverride($request, 'uiLanguage', (bool) ($this->ui['language_switcher'] ?? true)),
            'viewSwitcher' => $this->booleanOverride($request, 'uiView', (bool) ($this->ui['view_switcher'] ?? true)),
            'fullTools' => $this->enumOverride($request, 'uiTools', ['common', 'full'], 'common') === 'full',
        ];
        $config = [
            'apiBase' => $this->router->generate('sofinder_api_config'),
            'csrfToken' => $this->csrf->token(SymfonyRequestContextProvider::fromRequest($request)),
            'language' => $language,
            'resource' => $resource,
            'pickerResource' => $pickerResource,
            'initialPath' => $initialPath,
            'selectMode' => $selectMode,
            'selectionKind' => in_array((string) $request->query->get('selection', ''), ['file', 'image'], true) ? (string) $request->query->get('selection') : 'any',
            'ckeditorFunction' => (int) $request->query->get('CKEditorFuncNum', 0),
            'pickerRequestId' => $pickerRequestId,
            'pickerOrigin' => $pickerRequestId === '' ? '' : $this->pickerOrigin($request),
            'theme' => $this->theme->values(),
            'featureDefaults' => ['folderTree' => (bool) ($this->ui['folder_tree'] ?? false)],
            'featureAvailability' => $this->features?->browserAvailability() ?? (new FeaturePolicy())->browserAvailability(),
            'securityStatusAvailable' => ($this->features?->enabled('security_status') ?? true)
                && ($this->securityStatusRoles === [] || ($this->authorization !== null && (bool) array_filter($this->securityStatusRoles, $this->authorization->isGranted(...)))),
            'uiDefaults' => [
                'scale' => (string) ($this->ui['scale'] ?? 'standard'),
                'uploadConflictStrategy' => (string) ($this->ui['upload_conflict_strategy'] ?? 'ask'),
                'lowercaseUploadExtensions' => (bool) ($this->ui['lowercase_upload_extensions'] ?? true),
                ...$ui,
            ],
            'workspace' => $this->workspaceConfiguration($request),
        ];
        $encoded = htmlspecialchars(json_encode($config, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $version = rawurlencode($this->assetVersion);
        $css = htmlspecialchars($this->router->generate('sofinder_asset', ['file' => 'sofinder.css']) . '?v=' . $version, ENT_QUOTES, 'UTF-8');
        $js = htmlspecialchars($this->router->generate('sofinder_asset', ['file' => 'sofinder.js']) . '?v=' . $version, ENT_QUOTES, 'UTF-8');
        $html = <<<HTML
<!doctype html>
<html lang="{$language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>SoFinder</title>
  <link rel="stylesheet" href="{$css}">
</head>
<body>
  <div id="sofinder-root" data-config="{$encoded}"></div>
  <noscript>SoFinder requires JavaScript.</noscript>
  <script type="module" src="{$js}"></script>
</body>
</html>
HTML;

        return new Response($html, headers: [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-store, private',
            'X-Frame-Options' => 'SAMEORIGIN',
        ]);
    }

    /** @return array{id:string,resources:list<string>,options:list<array{id:string,label:string,url:string}>}|null */
    private function workspaceConfiguration(Request $request): ?array
    {
        if ($this->workspaces === null) return null;
        $current = $this->workspaces->current();
        $context = $this->workspaces->context();
        $options = $context === null ? [] : ($this->workspaceOptions?->options($context, $current) ?? []);
        $options = array_values(array_filter($options, $this->validWorkspaceOption(...)));

        return $current->jsonSerialize() + ['options' => $options];
    }

    /** @param array{id?:mixed,label?:mixed,url?:mixed} $option */
    private function validWorkspaceOption(array $option): bool
    {
        if (!is_string($option['id'] ?? null) || !is_string($option['label'] ?? null) || !is_string($option['url'] ?? null)) return false;
        $path = parse_url($option['url'], PHP_URL_PATH);

        return preg_match('/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/D', $option['id']) === 1
            && trim($option['label']) !== '' && strlen($option['label']) <= 100
            && is_string($path) && str_starts_with($path, '/') && !str_starts_with($path, '//')
            && preg_match('#(?:^|/)\.\.(?:/|$)|[\x00-\x1F\x7F]#', $path) !== 1
            && parse_url($option['url'], PHP_URL_SCHEME) === null && parse_url($option['url'], PHP_URL_HOST) === null;
    }

    /** @param list<string> $allowed */
    private function enumOverride(Request $request, string $name, array $allowed, string $fallback): string
    {
        $value = (string) $request->query->get($name, '');

        return in_array($value, $allowed, true) ? $value : $fallback;
    }

    private function booleanOverride(Request $request, string $name, bool $fallback): bool
    {
        $value = $request->query->get($name);
        if ($value === '1') {
            return true;
        }
        if ($value === '0') {
            return false;
        }

        return $fallback;
    }

    private function safePath(string $path): string
    {
        if ($path === '' || strlen($path) > 2048 || preg_match('//u', $path) !== 1 || preg_match('/[\x00-\x1F\x7F]/u', $path) === 1) {
            return '';
        }

        return str_replace('\\', '/', trim($path, '/'));
    }

    private function pickerRequestId(string $value): string
    {
        return preg_match('/^[A-Za-z0-9-]{16,80}$/D', $value) === 1 ? $value : '';
    }

    private function pickerOrigin(Request $request): string
    {
        $sameOrigin = $request->getSchemeAndHttpHost();
        $requested = rtrim($request->query->getString('pickerOrigin'), '/');
        if ($requested === '' || $requested === $sameOrigin) {
            return $sameOrigin;
        }
        if (in_array($requested, $this->pickerAllowedOrigins, true)) {
            return $requested;
        }

        throw new SoFinderException('The requested picker origin is not allowed.', 'invalid_picker_origin', 400);
    }
}
