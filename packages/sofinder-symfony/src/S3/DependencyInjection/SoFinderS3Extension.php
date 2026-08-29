<?php

declare(strict_types=1);

namespace SohoPHP\SoFinderS3\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\Extension\Extension;

final class SoFinderS3Extension extends Extension
{
    private const FACTORY_CLASS = 'SohoPHP\\SoFinderS3\\S3StorageAdapterFactory';

    /** @param array<array<string,mixed>> $configs */
    public function load(array $configs, ContainerBuilder $container): void
    {
        $container->setDefinition(self::FACTORY_CLASS, (new Definition(self::FACTORY_CLASS))->addTag('sofinder.storage_factory'));
    }
}
