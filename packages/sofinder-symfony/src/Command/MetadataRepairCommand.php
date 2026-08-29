<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Maintenance\MetadataRepairer;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'sofinder:metadata:repair', description: 'Preview or repair local SoFinder metadata references and shape.')]
final class MetadataRepairCommand extends Command
{
    public function __construct(private readonly MetadataRepairer $repairer) { parent::__construct(); }

    protected function configure(): void
    {
        $this->addOption('dry-run', null, InputOption::VALUE_NONE, 'Report repairs without changing metadata.')
            ->addOption('json', null, InputOption::VALUE_NONE, 'Write a machine-readable result.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $result = $this->repairer->repair((bool) $input->getOption('dry-run'));
        if ($input->getOption('json')) $output->writeln(json_encode($result, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
        else {
            $io = new SymfonyStyle($input, $output);
            if (!$result['supported']) $io->warning('The active shared metadata service must provide its own repair tooling.');
            else $io->success(sprintf('%s metadata: %d user(s), %d resource set(s), %d invalid reference(s).', $result['dryRun'] ? 'Inspected' : 'Repaired', $result['users'], $result['resources'], $result['removed']));
        }
        return $result['supported'] ? Command::SUCCESS : Command::INVALID;
    }
}
