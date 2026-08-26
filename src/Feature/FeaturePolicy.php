<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Feature;

use SohoPHP\SoFinder\Exception\SoFinderException;

/** Host-controlled upper bound for optional browser and HTTP capabilities. */
final readonly class FeaturePolicy
{
    private const FEATURES = ['folder_tree', 'recent', 'favorites', 'tags', 'archive', 'trash'];

    /** @param array<string,bool> $features */
    public function __construct(private array $features = [])
    {
    }

    public function enabled(string $feature): bool
    {
        if (!in_array($feature, self::FEATURES, true)) {
            throw new \InvalidArgumentException(sprintf('Unknown SoFinder feature "%s".', $feature));
        }

        return $this->features[$feature] ?? true;
    }

    public function assertEnabled(string $feature): void
    {
        if (!$this->enabled($feature)) {
            throw new SoFinderException('This SoFinder feature is disabled by the host application.', 'feature_disabled', 404);
        }
    }

    /** @return array{folderTree:bool,recent:bool,favorites:bool,tags:bool,archive:bool,trash:bool} */
    public function browserAvailability(): array
    {
        return [
            'folderTree' => $this->enabled('folder_tree'),
            'recent' => $this->enabled('recent'),
            'favorites' => $this->enabled('favorites'),
            'tags' => $this->enabled('tags'),
            'archive' => $this->enabled('archive'),
            'trash' => $this->enabled('trash'),
        ];
    }
}
