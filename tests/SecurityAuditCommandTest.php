<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Command\SecurityAuditCommand;
use SohoPHP\SoFinder\ResourceRegistry;
use SohoPHP\SoFinder\Storage\LocalStorageAdapter;
use SohoPHP\SoFinder\Value\ResourceStorage;
use SohoPHP\SoFinder\Value\ResourceType;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

final class SecurityAuditCommandTest extends TestCase
{
    public function testPublicAndProxyResourcesCannotShareAPhysicalRoot(): void
    {
        $base = sys_get_temp_dir() . '/sofinder-security-audit-' . bin2hex(random_bytes(8));
        $root = $base . '/storage';
        mkdir($root, 0775, true);
        foreach (['project', 'quarantine', 'chunks', 'trash'] as $directory) mkdir($base . '/' . $directory, 0775, true);
        $public = new ResourceType('Files', $root, '/files', deliveryMode: 'public');
        $private = new ResourceType('Private', $root, '', deliveryMode: 'proxy');
        $registry = new ResourceRegistry([
            new ResourceStorage($public, new LocalStorageAdapter($root, '/files')),
            new ResourceStorage($private, new LocalStorageAdapter($root, '')),
        ]);
        $tester = new CommandTester(new SecurityAuditCommand($registry, $base . '/project', $base . '/quarantine', $base . '/chunks', $base . '/trash'));
        try {
            $status = $tester->execute(['--json' => true]);
            $payload = json_decode($tester->getDisplay(), true, 512, JSON_THROW_ON_ERROR);
            self::assertSame(Command::FAILURE, $status);
            self::assertSame('critical', $payload['status']);
            self::assertNotEmpty(array_filter($payload['findings'], static fn (array $finding): bool => str_contains($finding['message'], 'share the same physical storage root')));
        } finally {
            foreach (['storage', 'project', 'quarantine', 'chunks', 'trash'] as $directory) @rmdir($base . '/' . $directory);
            @rmdir($base);
        }
    }

    public function testClusterAsyncOfficeRequiresAnExplicitSharedPreviewCache(): void
    {
        $base = sys_get_temp_dir() . '/sofinder-preview-audit-' . bin2hex(random_bytes(8));
        foreach (['project', 'quarantine', 'chunks', 'trash'] as $directory) mkdir($base . '/' . $directory, 0775, true);
        $command = new SecurityAuditCommand(new ResourceRegistry([]), $base . '/project', $base . '/quarantine', $base . '/chunks', $base . '/trash', clusterStateConfigured: true, sharedPreviewCache: false, documentPreviewMode: 'messenger', officePreviewEnabled: true);
        $tester = new CommandTester($command);
        try {
            self::assertSame(Command::FAILURE, $tester->execute(['--json' => true]));
            self::assertStringContainsString('shared document preview cache', $tester->getDisplay());
        } finally {
            foreach (['project', 'quarantine', 'chunks', 'trash'] as $directory) @rmdir($base . '/' . $directory);
            @rmdir($base);
        }
    }
}
