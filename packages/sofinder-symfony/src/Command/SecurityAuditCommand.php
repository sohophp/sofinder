<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Command;

use SohoPHP\SoFinder\Contract\HealthCheckInterface;
use SohoPHP\SoFinder\Contract\ImageCapabilityProviderInterface;
use SohoPHP\SoFinder\Contract\WorkspaceStorageAuditProviderInterface;
use SohoPHP\SoFinder\Image\ImageFormatRegistry;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Security\SecurityAuditor;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'sofinder:security:audit', description: 'Audit SoFinder storage and private working-directory security.')]
final class SecurityAuditCommand extends Command
{
    private readonly SecurityAuditor $auditor;

    /**
     * The framework-neutral auditor may be injected by a bridge. The original
     * arguments remain supported so applications constructing this command
     * directly retain their 1.x-compatible API.
     *
     * @param iterable<WorkspaceStorageAuditProviderInterface> $workspaceStorageAuditProviders
     */
    public function __construct(
        ResourceRegistry $resources,
        string $projectDirectory,
        string $quarantineDirectory,
        string $chunkDirectory,
        string $trashDirectory,
        ?ImageCapabilityProviderInterface $images = null,
        ?ImageFormatRegistry $imageFormats = null,
        bool $malwareScanningEnabled = false,
        ?HealthCheckInterface $malwareScanner = null,
        bool $clusterStateConfigured = false,
        bool $sharedPreviewCache = false,
        string $documentPreviewMode = 'inline',
        bool $officePreviewEnabled = false,
        iterable $workspaceStorageAuditProviders = [],
        ?SecurityAuditor $auditor = null,
    ) {
        $this->auditor = $auditor ?? new SecurityAuditor(
            $resources,
            $projectDirectory,
            $quarantineDirectory,
            $chunkDirectory,
            $trashDirectory,
            $images,
            $imageFormats,
            $malwareScanningEnabled,
            $malwareScanner,
            $clusterStateConfigured,
            $sharedPreviewCache,
            $documentPreviewMode,
            $officePreviewEnabled,
            $workspaceStorageAuditProviders,
        );
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('json', null, InputOption::VALUE_NONE, 'Write a machine-readable result.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $result = $this->auditor->audit();
        if ($input->getOption('json') === true) {
            $output->writeln(json_encode($result->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return $result->criticalCount() > 0 ? Command::FAILURE : Command::SUCCESS;
        }

        $io = new SymfonyStyle($input, $output);
        if ($result->findings === []) {
            $io->success('No SoFinder storage security problems were detected.');

            return Command::SUCCESS;
        }
        $io->table(['Severity', 'Scope', 'Finding'], array_map(
            static fn (array $finding): array => [$finding['severity'], $finding['scope'], $finding['message']],
            $result->findings,
        ));
        if ($result->criticalCount() > 0) {
            $io->error(sprintf('%d critical SoFinder security finding(s) require attention.', $result->criticalCount()));

            return Command::FAILURE;
        }
        $io->warning('The audit completed with warnings.');

        return Command::SUCCESS;
    }
}
