<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Maintenance\CacheCleaner;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'sofinder:cache:cleanup', description: 'Preview or remove expired SoFinder thumbnail and document-preview cache files.')]
final class CacheCleanupCommand extends Command
{
    public function __construct(private readonly CacheCleaner $cleaner) { parent::__construct(); }

    protected function configure(): void
    {
        $this
            ->addOption('older-than', null, InputOption::VALUE_REQUIRED, 'Minimum cache age in seconds.', '86400')
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Report matching files without removing them.')
            ->addOption('json', null, InputOption::VALUE_NONE, 'Write a machine-readable result.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $age = $input->getOption('older-than');
        if (!is_string($age) || preg_match('/^\d+$/D', $age) !== 1 || (int) $age < 60) {
            $output->writeln('<error>--older-than must be an integer of at least 60 seconds.</error>');
            return Command::INVALID;
        }
        $result = $this->cleaner->clean((int) $age, (bool) $input->getOption('dry-run'));
        if ($input->getOption('json')) {
            $output->writeln(json_encode($result, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
        } else {
            $io = new SymfonyStyle($input, $output);
            $io->success(sprintf('%s %d cache file(s), %d bytes; %d error(s).', $result['dryRun'] ? 'Matched' : 'Removed', $result['dryRun'] ? $result['matched'] : $result['removed'], $result['bytes'], count($result['errors'])));
        }

        return $result['errors'] === [] ? Command::SUCCESS : Command::FAILURE;
    }
}
