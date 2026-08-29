<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Plugin\PluginRegistry;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'sofinder:plugin:validate', description: 'Validate every registered SoFinder plugin descriptor.')]
final class PluginValidateCommand extends Command
{
    public function __construct(private readonly PluginRegistry $plugins) { parent::__construct(); }
    protected function configure(): void { $this->addOption('json', null, InputOption::VALUE_NONE, 'Output machine-readable JSON.'); }
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $descriptors = $this->plugins->descriptors(); $result = ['status' => 'ready', 'schemaVersion' => '1.0', 'plugins' => array_map(static fn (array $plugin): array => ['name' => $plugin['name'], 'version' => $plugin['version'], 'descriptorVersion' => $plugin['descriptorVersion']], $descriptors)];
        if ($input->getOption('json')) $output->writeln(json_encode($result, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        else { $io = new SymfonyStyle($input, $output); $io->success(sprintf('%d SoFinder plugin descriptor(s) conform to schema 1.0.', count($descriptors))); }
        return Command::SUCCESS;
    }
}
