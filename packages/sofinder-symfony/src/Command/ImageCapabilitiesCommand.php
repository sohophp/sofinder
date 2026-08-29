<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\ResourceRegistry;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'sofinder:image:capabilities', description: 'Show effective image codecs and validate configured resource formats.')]
final class ImageCapabilitiesCommand extends Command
{
    public function __construct(
        private readonly ImageCapabilityProviderInterface $images,
        private readonly ImageFormatRegistry $formats,
        private readonly ResourceRegistry $resources,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('json', null, InputOption::VALUE_NONE, 'Output machine-readable JSON.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $capabilities = $this->images->capabilities();
        $unsupported = [];
        foreach ($this->resources->all() as $storage) {
            foreach ($storage->resource->allowedExtensions as $extension) {
                if ($this->formats->formatForExtension($extension) !== null && !$this->images->supportsExtension($extension)) {
                    $unsupported[] = ['resource' => $storage->resource->name, 'extension' => strtolower($extension)];
                }
            }
        }
        if ($input->getOption('json')) {
            $output->writeln(json_encode([
                'driver' => $this->images->driver(),
                'formats' => $capabilities,
                'unsupportedConfiguredFormats' => $unsupported,
            ], JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

            return $unsupported === [] ? Command::SUCCESS : Command::FAILURE;
        }

        $io = new SymfonyStyle($input, $output);
        $io->title('SoFinder image capabilities (' . $this->images->driver() . ')');
        $io->table(['Format', 'Extensions', 'Processor', 'Read', 'Edit', 'Thumbnail', 'Web'], array_map(
            static fn (array $item): array => [
                strtoupper($item['format']),
                implode(', ', $item['extensions']),
                $item['processor'] === '' ? '—' : $item['processor'],
                $item['read'] ? 'yes' : 'no',
                $item['edit'] ? 'yes' : 'no',
                $item['thumbnail'] ? 'yes' : 'no',
                $item['webEmbeddable'] ? 'yes' : 'no',
            ],
            $capabilities,
        ));
        if ($unsupported !== []) {
            $io->error(array_map(static fn (array $item): string => sprintf('%s configures unsupported image extension .%s.', $item['resource'], $item['extension']), $unsupported));

            return Command::FAILURE;
        }
        $io->success('Every configured image extension has an available decoder.');

        return Command::SUCCESS;
    }
}
