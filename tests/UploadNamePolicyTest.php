<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Upload\UploadNamePolicy;

final class UploadNamePolicyTest extends TestCase
{
    public function testItLowercasesOnlyTheFinalExtensionByDefault(): void
    {
        $policy = new UploadNamePolicy();

        self::assertSame('Report.xlsx', $policy->normalize('Report.XLSX'));
        self::assertSame('Release.V1.pdf', $policy->normalize('Release.V1.PDF'));
        self::assertSame('README', $policy->normalize('README'));
        self::assertSame('.ENV', $policy->normalize('.ENV'));
        self::assertSame('file.', $policy->normalize('file.'));
    }

    public function testHostCanPreserveTheOriginalExtensionCase(): void
    {
        self::assertSame('Manual.PDF', (new UploadNamePolicy(false))->normalize('Manual.PDF'));
    }
}
