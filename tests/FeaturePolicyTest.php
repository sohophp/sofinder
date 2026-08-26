<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Tests;

use PHPUnit\Framework\TestCase;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\Feature\FeaturePolicy;

final class FeaturePolicyTest extends TestCase
{
    public function testDefaultsRemainBackwardCompatible(): void
    {
        self::assertSame([], array_filter((new FeaturePolicy())->browserAvailability(), static fn (bool $enabled): bool => !$enabled));
    }

    public function testDisabledFeatureIsNotPublishedAndCannotBeInvoked(): void
    {
        $policy = new FeaturePolicy(['archive' => false]);
        self::assertFalse($policy->browserAvailability()['archive']);

        try {
            $policy->assertEnabled('archive');
            self::fail('The disabled feature was accepted.');
        } catch (SoFinderException $exception) {
            self::assertSame('feature_disabled', $exception->errorCode);
            self::assertSame(404, $exception->httpStatus);
        }
    }
}
