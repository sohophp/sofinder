<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Psr15;

use SohoPHP\SoFinder\Contract\EndpointUrlGeneratorInterface;
use SohoPHP\SoFinder\Http\EndpointCatalog;

final class CatalogUrlGenerator implements EndpointUrlGeneratorInterface
{
    public function __construct(private readonly string $prefix = '/sofinder', private readonly string $baseUrl = '')
    {
    }

    public function generate(string $endpoint, array $parameters = [], bool $absolute = false): string
    {
        $path = EndpointCatalog::get($endpoint)->path;
        $used = [];
        $path = (string) preg_replace_callback('/\{([A-Za-z][A-Za-z0-9_]*)\}/', static function (array $matches) use ($parameters, &$used): string {
            $name = $matches[1];
            if (!array_key_exists($name, $parameters) || !is_scalar($parameters[$name])) throw new \InvalidArgumentException(sprintf('Missing URL parameter "%s".', $name));
            $used[$name] = true;
            return rawurlencode((string) $parameters[$name]);
        }, $path);
        $query = array_diff_key($parameters, $used);
        $prefix = '/' . trim($this->prefix, '/');
        $url = ($prefix === '/' ? '' : $prefix) . $path;
        if ($query !== []) $url .= '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
        if (!$absolute) return $url;
        if ($this->baseUrl === '') throw new \LogicException('Absolute SoFinder URLs require a configured base URL.');
        return rtrim($this->baseUrl, '/') . $url;
    }
}
