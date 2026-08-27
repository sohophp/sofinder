<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Metadata;

use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\MetadataStoreInterface;
use SohoPHP\SoFinder\Contract\QuickAccessMetadataStoreInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;
use SohoPHP\SoFinder\Workspace\WorkspaceProvider;

final readonly class MetadataManager
{
    public const MAX_QUICK_ACCESS = 12;

    public function __construct(
        private FileManager $files,
        private MetadataStoreInterface $store,
        private ActorProviderInterface $actors,
        private bool $allowQuickAccessFiles = true,
        private ?WorkspaceProvider $workspaces = null,
    ) {
    }

    /** @return array{favorites:list<string>,quickAccess:list<string>,tags:array<string,list<string>>,recent:list<array{path:string,touchedAt:int}>} */
    public function get(string $resource): array
    {
        $this->files->entry($resource, '');

        $metadata = $this->store->get($this->actor(), $resource);
        $metadata['quickAccess'] = array_slice(array_values(array_filter((array) ($metadata['quickAccess'] ?? []), 'is_string')), 0, self::MAX_QUICK_ACCESS);

        return $metadata;
    }

    public function favorite(string $resource, string $path, bool $favorite): void
    {
        $entry = $this->files->entry($resource, $path);
        $this->store->setFavorite($this->actor(), $resource, $entry->path, $favorite);
    }

    public function quickAccess(string $resource, string $path, bool $pinned): void
    {
        if (!$this->store instanceof QuickAccessMetadataStoreInterface) {
            throw new SoFinderException('The configured metadata store does not support quick access.', 'quick_access_unsupported', 501);
        }
        $entry = $this->files->entry($resource, $path);
        if ($pinned && !$entry->directory && !$this->allowQuickAccessFiles) {
            throw new SoFinderException('Files are disabled for quick access.', 'quick_access_file_disabled', 422);
        }
        $actor = $this->actor();
        $current = (array) ($this->store->get($actor, $resource)['quickAccess'] ?? []);
        if ($pinned && !in_array($entry->path, $current, true) && count($current) >= self::MAX_QUICK_ACCESS) {
            throw new SoFinderException('Quick access is limited to 12 entries.', 'quick_access_limit', 409);
        }
        $this->store->setQuickAccess($actor, $resource, $entry->path, $pinned);
    }

    /** @return list<array{path:string,name:string,directory:?bool,mimeType:?string,exists:bool}> */
    public function quickAccessEntries(string $resource): array
    {
        $entries = [];
        foreach ($this->get($resource)['quickAccess'] as $path) {
            try {
                $entry = $this->files->entry($resource, $path);
                $entries[] = ['path' => $entry->path, 'name' => $entry->name, 'directory' => $entry->directory, 'mimeType' => $entry->mimeType, 'exists' => true];
            } catch (SoFinderException $exception) {
                if ($exception->errorCode !== 'not_found') throw $exception;
                $entries[] = ['path' => $path, 'name' => basename($path), 'directory' => null, 'mimeType' => null, 'exists' => false];
            }
        }
        return $entries;
    }

    /** @param list<string> $tags */
    public function tags(string $resource, string $path, array $tags): void
    {
        $entry = $this->files->entry($resource, $path);
        $normalized = [];
        foreach ($tags as $tag) {
            $tag = trim($tag);
            if ($tag === '' || mb_strlen($tag) > 30 || preg_match('/[\x00-\x1F\x7F]/u', $tag) === 1) {
                throw new SoFinderException('Tags must contain 1 to 30 visible characters.', 'invalid_tags', 422);
            }
            $normalized[mb_strtolower($tag)] = $tag;
        }
        if (count($normalized) > 10) {
            throw new SoFinderException('An entry can have at most 10 tags.', 'invalid_tags', 422);
        }
        $this->store->setTags($this->actor(), $resource, $entry->path, array_values($normalized));
    }

    public function touch(string $resource, string $path): void
    {
        $entry = $this->files->entry($resource, $path);
        $this->store->touch($this->actor(), $resource, $entry->path, time());
    }

    /** Remove metadata for a path that disappeared outside SoFinder after reauthorizing its parent. */
    public function forget(string $resource, string $path): void
    {
        $separator = strrpos($path, '/');
        $parent = $separator === false ? '' : substr($path, 0, $separator);
        while (true) {
            try {
                $this->files->entry($resource, $parent);
                break;
            } catch (SoFinderException $exception) {
                if ($exception->errorCode !== 'not_found' || $parent === '') {
                    throw $exception;
                }
                $separator = strrpos($parent, '/');
                $parent = $separator === false ? '' : substr($parent, 0, $separator);
            }
        }
        $this->store->deletePath($this->actor(), $resource, $path);
    }

    private function actor(): string
    {
        $actor = $this->actors->actorId();
        return $this->workspaces === null ? $actor : hash('sha256', 'workspace:' . $this->workspaces->current()->id . ':' . $actor);
    }
}
