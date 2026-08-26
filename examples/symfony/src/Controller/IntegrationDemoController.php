<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;

final readonly class IntegrationDemoController
{
    public function __invoke(): Response
    {
        $html = <<<'HTML'
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>SoFinder 编辑器集成演示</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css">
  <style>
    :root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#172033;background:#f4f6fa}body{margin:0}.shell{max-width:1080px;margin:auto;padding:32px 20px 80px}.hero,.card{background:#fff;border:1px solid #dfe5ee;border-radius:14px;box-shadow:0 8px 30px rgba(29,47,74,.06)}.hero{padding:24px;margin-bottom:18px}.hero h1{margin:0 0 8px;font-size:28px}.hero p{margin:0;color:#607086}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.tabs button,.action{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:9px 14px;cursor:pointer}.tabs button.active,.action{color:#fff;background:#276ef1;border-color:#276ef1}.card{padding:20px}.pane{display:none}.pane.active{display:block}.pane h2{margin-top:0}.editor-box,#tiptap-editor{min-height:220px;border:1px solid #cbd5e1;border-radius:8px;padding:14px;background:#fff}.toolbar{display:flex;gap:8px;margin-bottom:10px}.field{width:min(100%,720px);padding:10px;border:1px solid #cbd5e1;border-radius:8px}.status{min-height:24px;margin-top:10px;color:#526174}.note{font-size:13px;color:#6b7280}.ck-editor__editable{min-height:220px}#quill-editor{height:220px}
  </style>
  <script src="https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tinymce@8.0.2/tinymce.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
</head>
<body>
<main class="shell">
  <section class="hero"><h1>SoFinder 编辑器集成演示</h1><p>同一个安全 Picker SDK 连接 CKEditor 5、TinyMCE、TipTap、Quill 和普通表单。先用 <strong>demo / demo</strong> 登录。</p></section>
  <nav class="tabs" aria-label="编辑器"><button class="active" data-pane="plain">普通表单</button><button data-pane="ckeditor">CKEditor 5</button><button data-pane="tinymce">TinyMCE 8</button><button data-pane="tiptap">TipTap</button><button data-pane="quill">Quill 2</button></nav>
  <section class="card">
    <div class="pane active" id="plain"><h2>普通 URL 字段</h2><div class="toolbar"><button class="action" id="plain-choose">选择文件</button></div><input class="field" id="file-url" aria-label="文件 URL" placeholder="选择结果会写入这里"><p class="status" id="plain-status"></p></div>
    <div class="pane" id="ckeditor"><h2>CKEditor 5</h2><div class="toolbar"><button class="action" id="ckeditor-choose">从 SoFinder 插入图片</button></div><div id="ckeditor-editor"><p>在这里编辑内容，然后从 SoFinder 插入图片。</p></div><p class="status" id="ckeditor-status"></p><p class="note">演示固定使用 CKEditor 5 的官方经典版 CDN；正式项目请按所选版本的授权条款部署。</p></div>
    <div class="pane" id="tinymce"><h2>TinyMCE 8</h2><textarea id="tinymce-editor">在这里编辑内容，然后点击工具栏中的 Files。</textarea><p class="status" id="tinymce-status"></p><p class="note">演示从 jsDelivr 加载 GPL 自托管发行包，不依赖 Tiny Cloud API key。</p></div>
    <div class="pane" id="tiptap"><h2>TipTap</h2><div class="toolbar"><button class="action" id="tiptap-choose">从 SoFinder 插入图片</button></div><div id="tiptap-editor"></div><p class="status" id="tiptap-status"></p></div>
    <div class="pane" id="quill"><h2>Quill 2</h2><div id="quill-editor"><p>点击 Quill 工具栏的图片按钮选择 SoFinder 图片。</p></div><p class="status" id="quill-status"></p></div>
  </section>
</main>
<script type="module">
  import { registerQuill, registerTinyMce, selectForCkeditor5, selectForInput, selectForTiptap } from '/sofinder/assets/sofinder-picker.js';
  const baseUrl = '/sofinder/browser';
  const imageOptions = { baseUrl, resource: 'Files', tools: 'common' };
  const status = (id, value) => document.getElementById(id).textContent = value ? `已选择：${value.name}` : '';
  document.querySelectorAll('[data-pane]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-pane]').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('.pane').forEach(pane => pane.classList.toggle('active', pane.id === button.dataset.pane));
  }));
  document.getElementById('plain-choose').addEventListener('click', async () => status('plain-status', await selectForInput(document.getElementById('file-url'), { baseUrl, kind: 'file', resource: 'Files' })));

  let ckeditor;
  try {
    ckeditor = await window.ClassicEditor.create(document.getElementById('ckeditor-editor'), { toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'link'] });
    document.getElementById('ckeditor-choose').addEventListener('click', async () => status('ckeditor-status', await selectForCkeditor5(ckeditor, imageOptions)));
  } catch (error) { document.getElementById('ckeditor-status').textContent = `CKEditor 初始化失败：${error.message}`; }

  registerTinyMce(window.tinymce, imageOptions);
  window.tinymce.init({ selector: '#tinymce-editor', height: 280, base_url: 'https://cdn.jsdelivr.net/npm/tinymce@8.0.2', suffix: '.min', license_key: 'gpl', plugins: 'sofinder link lists image', toolbar: 'undo redo | bold italic | link image sofinder', promotion: false });

  const [{ Editor }, { default: StarterKit }, { default: Image }] = await Promise.all([import('https://esm.sh/@tiptap/core'), import('https://esm.sh/@tiptap/starter-kit'), import('https://esm.sh/@tiptap/extension-image')]);
  const tiptap = new Editor({ element: document.getElementById('tiptap-editor'), extensions: [StarterKit, Image], content: '<p>在这里编辑内容，然后从 SoFinder 插入图片。</p>' });
  document.getElementById('tiptap-choose').addEventListener('click', async () => status('tiptap-status', await selectForTiptap(tiptap, imageOptions)));

  const quill = new window.Quill('#quill-editor', { theme: 'snow', modules: { toolbar: [['bold', 'italic'], ['link', 'image']] } });
  registerQuill(quill, imageOptions);
</script>
</body>
</html>
HTML;

        return new Response($html, headers: [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-store, private',
            'X-Content-Type-Options' => 'nosniff',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
        ]);
    }
}
