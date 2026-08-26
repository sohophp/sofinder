<?php

declare(strict_types=1);

namespace App\Plugin;

use SohoPHP\SoFinder\Contract\HealthCheckInterface;
use SohoPHP\SoFinder\Contract\PluginInterface;
use SohoPHP\SoFinder\Value\HealthCheckResult;

/** A runnable reference plugin: descriptor, UI action and readiness check. */
final class FileInspectorPlugin implements PluginInterface, HealthCheckInterface
{
    public function descriptor(): array
    {
        return [
            'name' => 'example-file-inspector',
            'version' => '1.0.0',
            'capabilities' => ['file-inspection'],
            'uiActions' => [[
                'id' => 'inspect-file',
                'label' => ['en' => 'Inspect file', 'zh-cn' => '检查文件', 'zh-tw' => '檢查檔案'],
                'slot' => 'context',
                'url' => '/integrations/plugin-inspector',
                'selection' => 'file',
                'requires' => 'read',
            ]],
        ];
    }

    public function check(): HealthCheckResult
    {
        return new HealthCheckResult('example-file-inspector', 'ready', 'Reference plugin is registered.');
    }
}
