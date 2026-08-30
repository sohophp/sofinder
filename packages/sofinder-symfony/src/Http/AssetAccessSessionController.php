<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Http;

use SohoPHP\SoFinder\Asset\AssetAccessSessionManager;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Symfony\CsrfGuard;
use SohoPHP\SoFinder\Symfony\SymfonyRequestContextProvider;
use SohoPHP\SoFinder\Symfony\SymfonyStreamResponseFactory;
use SohoPHP\SoFinder\Value\OperationResult;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

final class AssetAccessSessionController
{
    public function __construct(private readonly AssetAccessSessionManager $sessions, private readonly CsrfGuard $csrf, private readonly RouterInterface $router, private readonly ContentController $content, private readonly ?AssetAccessSessionActions $actions = null) {}

    public function create(Request $request): JsonResponse
    {
        if ($this->actions !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $this->actions->create->assertAllowed($context, $request->request->all());
            $result = $this->actions->create->execute($context, $this->json($request));

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $this->csrf->assertMutation($request); $data = $this->json($request); $ids = array_values(array_filter(is_array($data['assetIds'] ?? null) ? $data['assetIds'] : [], 'is_string'));
        $created = $this->sessions->create($ids, isset($data['ttl']) ? (int) $data['ttl'] : null); $token = $created['token'];
        $assets = array_map(fn (array $asset): array => $asset + ['url' => $this->router->generate('sofinder_asset_session_content', ['token' => $token, 'assetId' => $asset['assetId']], UrlGeneratorInterface::ABSOLUTE_URL)], $created['assets']);
        return new JsonResponse(OperationResult::success(['id' => $created['id'], 'expiresAt' => $created['expiresAt'], 'assets' => $assets]), 201);
    }

    public function revoke(Request $request, string $id): JsonResponse
    {
        if ($this->actions !== null) {
            $context = SymfonyRequestContextProvider::fromRequest($request);
            $this->actions->revoke->assertAllowed($context, $request->request->all());
            $result = $this->actions->revoke->execute($context, ['id' => $id]);

            return new JsonResponse($result->payload, $result->status, $result->headers);
        }
        $this->csrf->assertMutation($request); $this->sessions->revoke($id); return new JsonResponse(OperationResult::success([]));
    }

    public function consume(Request $request, string $token, string $assetId): Response
    {
        if ($this->actions !== null) {
            return SymfonyStreamResponseFactory::create($this->actions->content->execute(
                SymfonyRequestContextProvider::fromRequest($request),
                ['token' => $token, 'assetId' => $assetId],
            ));
        }
        $opened = $this->sessions->open($token, $assetId); $response = $this->content->stream($request, $opened['resource'], $opened['entry'], $opened['stream'], 'inline');
        $response->setPrivate(); $response->setMaxAge(max(0, $opened['expiresAt'] - time())); $response->headers->set('Referrer-Policy', 'no-referrer'); return $response;
    }

    /** @return array<string,mixed> */
    private function json(Request $request): array { try { $data = json_decode($request->getContent(), true, 32, JSON_THROW_ON_ERROR); } catch (\JsonException $error) { throw new SoFinderException('The request body must be valid JSON.', 'invalid_json', 400, $error); } if (!is_array($data)) throw new SoFinderException('The request body must be an object.', 'invalid_json', 400); return $data; }
}
