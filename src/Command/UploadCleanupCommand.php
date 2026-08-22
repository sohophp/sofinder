<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Contract\ChunkUploadStoreInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'sofinder:uploads:cleanup', description: 'Remove expired SoFinder chunk-upload sessions.')]
final class UploadCleanupCommand extends Command
{
    public function __construct(private readonly ChunkUploadStoreInterface $chunks)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $purged = $this->chunks->cleanupExpired(true);
        $output->writeln(sprintf('Purged %d expired SoFinder upload session(s).', $purged));

        return Command::SUCCESS;
    }
}
