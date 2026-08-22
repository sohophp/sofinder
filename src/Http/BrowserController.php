<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Value\Theme;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final readonly class BrowserController
{
    public function __construct(
        private FileManager $files,
        private RouterInterface $router,
        private CsrfTokenManagerInterface $csrf,
        private string $assetVersion,
        private Theme $theme,
        /** @var array{folder_tree:bool} */
        private array $ui,
    ) {
    }

    public function __invoke(Request $request): Response
    {
        $this->files->resources();
        $language = strtolower((string) $request->query->get('lang', ''));
        if (!in_array($language, ['en', 'zh-cn', 'zh-tw'], true)) {
            $preferred = str_replace('_', '-', strtolower($request->getPreferredLanguage() ?? ''));
            $language = preg_match('/^zh-(tw|hk|mo)|^zh-hant/', $preferred) === 1
                ? 'zh-tw'
                : (str_starts_with($preferred, 'zh') ? 'zh-cn' : 'en');
        }
        $config = [
            'apiBase' => $this->router->generate('sofinder_api_config'),
            'csrfToken' => $this->csrf->getToken('sofinder')->getValue(),
            'language' => $language,
            'resource' => (string) $request->query->get('type', ''),
            'selectMode' => $request->query->has('CKEditorFuncNum') || $request->query->getBoolean('select'),
            'ckeditorFunction' => (int) $request->query->get('CKEditorFuncNum', 0),
            'theme' => $this->theme->values(),
            'featureDefaults' => ['folderTree' => (bool) ($this->ui['folder_tree'] ?? false)],
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
}
