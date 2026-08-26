<?php

declare(strict_types=1);

namespace SohoPHP\SoFinder\Preview;

use SohoPHP\SoFinder\Contract\PluginInterface;
use Symfony\Component\Routing\RouterInterface;

final readonly class DocumentPreviewPlugin implements PluginInterface
{
    public function __construct(private RouterInterface $router, private bool $pdfEnabled = true, private bool $officeEnabled = false) {}

    public function descriptor(): array
    {
        $previewers = [];
        $url = $this->router->generate('sofinder_document_preview');
        if ($this->pdfEnabled) $previewers[] = ['id' => 'pdf', 'mimeTypes' => ['application/pdf'], 'extensions' => ['pdf'], 'url' => $url];
        if ($this->officeEnabled) $previewers[] = [
            'id' => 'office',
            'mimeTypes' => [
                'application/msword', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/vnd.oasis.opendocument.text', 'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.presentation',
            ],
            'extensions' => ['doc', 'docx', 'odt', 'rtf', 'xls', 'xlsx', 'ods', 'ppt', 'pptx', 'odp'],
            'url' => $url,
        ];

        $capabilities = [];
        if ($this->pdfEnabled) $capabilities[] = 'preview.pdf';
        if ($this->officeEnabled) $capabilities[] = 'preview.office';

        return ['name' => 'document-preview', 'version' => '1.0.0', 'capabilities' => $capabilities, 'previewers' => $previewers];
    }
}
