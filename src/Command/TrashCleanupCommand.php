<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Contract\RecycleBinInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'sofinder:trash:cleanup', description: 'Permanently remove expired SoFinder recycle-bin entries.')]
final class TrashCleanupCommand extends Command
{
    public function __construct(private readonly RecycleBinInterface $trash)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $purged = $this->trash->purgeExpired();
        $output->writeln(sprintf('Purged %d expired SoFinder trash item(s).', $purged));

        return Command::SUCCESS;
    }
}
