<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Laravel;

use SohoPHP\SoFinder\Configuration\ConfigurationNormalizer;

final class LaravelConfiguration
{
    /** @var array<string,mixed> */
    private readonly array $values;

    /**
     * @param array<string,mixed> $config
     * @param array<string,mixed> $hostDefaults
     */
    public function __construct(array $config, array $hostDefaults)
    {
        $this->values = (new ConfigurationNormalizer())->normalize($config, $hostDefaults);
    }

    /** @return array<string,mixed> */
    public function all(): array
    {
        return $this->values;
    }

    public function get(string $key, mixed $default = null): mixed
    {
        $value = $this->values;
        foreach (explode('.', $key) as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }
            $value = $value[$segment];
        }

        return $value;
    }
}
