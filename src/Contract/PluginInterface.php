<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Contract;

/**
 * Public extension point for advertising host-provided SoFinder plugins.
 *
 * Plugins should use events and the replaceable service contracts for their
 * behaviour. This descriptor is intentionally data-only and safe to expose to
 * the browser.
 */
interface PluginInterface
{
    /**
     * @return array{
     *   name:string,
     *   version:string,
     *   capabilities:list<string>,
     *   uiActions?:list<array{id:string,label:array{en:string,zh-cn?:string,zh-tw?:string},slot:string,url:string,selection?:string,requires?:string}>,
     *   previewers?:list<array{id:string,mimeTypes?:list<string>,extensions?:list<string>,url:string}>
     * }
     */
    public function descriptor(): array;
}
