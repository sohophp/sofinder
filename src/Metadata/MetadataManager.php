<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Metadata;

use SohoPHP\SoFinder\Contract\ActorProviderInterface;
use SohoPHP\SoFinder\Contract\MetadataStoreInterface;
use SohoPHP\SoFinder\Exception\SoFinderException;
use SohoPHP\SoFinder\FileManager;

final readonly class MetadataManager
{
    public function __construct(
        private FileManager $files,
        private MetadataStoreInterface $store,
        private ActorProviderInterface $actors,
    ) {
    }

    /** @return array{favorites:list<string>,tags:array<string,list<string>>,recent:list<array{path:string,touchedAt:int}>} */
    public function get(string $resource): array
    {
        $this->files->entry($resource, '');

        return $this->store->get($this->actors->actorId(), $resource);
    }

    public function favorite(string $resource, string $path, bool $favorite): void
    {
        $entry = $this->files->entry($resource, $path);
        $this->store->setFavorite($this->actors->actorId(), $resource, $entry->path, $favorite);
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
        $this->store->setTags($this->actors->actorId(), $resource, $entry->path, array_values($normalized));
    }

    public function touch(string $resource, string $path): void
    {
        $entry = $this->files->entry($resource, $path);
        $this->store->touch($this->actors->actorId(), $resource, $entry->path, time());
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
        $this->store->deletePath($this->actors->actorId(), $resource, $path);
    }
}
