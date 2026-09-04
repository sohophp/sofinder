<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class IntegrationDemoController
{
  public function __construct(private readonly CsrfTokenManagerInterface $csrf) {}

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
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@wangeditor/editor@5.1.23/dist/css/style.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jodit@4.13.23/es2021/jodit.min.css">
  <style>
    :root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#172033;background:#f4f6fa}body{margin:0}.shell{max-width:1080px;margin:auto;padding:32px 20px 80px}.hero,.card{background:#fff;border:1px solid #dfe5ee;border-radius:14px;box-shadow:0 8px 30px rgba(29,47,74,.06)}.hero{padding:24px;margin-bottom:18px}.hero h1{margin:0 0 8px;font-size:28px}.hero p{margin:0;color:#607086}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.tabs button,.action{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:9px 14px;cursor:pointer}.tabs button.active,.action{color:#fff;background:#276ef1;border-color:#276ef1}.card{padding:20px}.pane{display:none}.pane.active{display:block}.pane h2{margin-top:0}.editor-box,#tiptap-editor{min-height:220px;border:1px solid #cbd5e1;border-radius:8px;padding:14px;background:#fff}.toolbar{display:flex;gap:8px;margin-bottom:10px}.field{width:min(100%,720px);padding:10px;border:1px solid #cbd5e1;border-radius:8px}.status{min-height:24px;margin-top:10px;color:#526174}.note{font-size:13px;color:#6b7280}.ck-editor__editable{min-height:220px}#quill-editor{height:220px}#wangeditor-shell{border:1px solid #cbd5e1;border-radius:8px;overflow:hidden}#wangeditor-editor{height:220px;overflow-y:auto}
  </style>
  <script src="https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tinymce@8.0.2/tinymce.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@wangeditor/editor@5.1.23/dist/index.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jodit@4.13.23/es2021/jodit.min.js"></script>
</head>
<body>
<main class="shell">
  <section class="hero"><h1>SoFinder 编辑器集成演示</h1><p>同一个安全 Picker SDK 连接 CKEditor 5、TinyMCE、TipTap、Quill、wangEditor、Jodit 和普通表单。先用 <strong>demo / demo</strong> 登录。</p></section>
  <nav class="tabs" aria-label="编辑器"><button class="active" data-pane="plain">普通表单</button><button data-pane="ckeditor">CKEditor 5</button><button data-pane="tinymce">TinyMCE 8</button><button data-pane="tiptap">TipTap</button><button data-pane="quill">Quill 2</button><button data-pane="wangeditor">wangEditor 5</button><button data-pane="jodit">Jodit 4</button></nav>
  <section class="card">
    <div class="pane active" id="plain"><h2>普通 URL 字段</h2><div class="toolbar"><button class="action" id="plain-choose">选择文件</button><label class="action">上传文件<input hidden type="file" id="plain-upload"></label></div><input class="field" id="file-url" aria-label="文件 URL" placeholder="选择或上传结果会写入这里"><p class="status" id="plain-status"></p></div>
    <div class="pane" id="ckeditor"><h2>CKEditor 5</h2><div class="toolbar"><button class="action" id="ckeditor-choose">从 SoFinder 插入图片</button></div><div id="ckeditor-editor"><p>可从 SoFinder 选择，也可以粘贴、拖入或使用图片上传按钮。</p></div><p class="status" id="ckeditor-status"></p><p class="note">演示固定使用 CKEditor 5 的官方经典版 CDN；正式项目请按所选版本的授权条款部署。</p></div>
    <div class="pane" id="tinymce"><h2>TinyMCE 8</h2><textarea id="tinymce-editor">在这里编辑内容，然后点击工具栏中的 Files。</textarea><p class="status" id="tinymce-status"></p><p class="note">演示从 jsDelivr 加载 GPL 自托管发行包，不依赖 Tiny Cloud API key。</p></div>
    <div class="pane" id="tiptap"><h2>TipTap</h2><div class="toolbar"><button class="action" id="tiptap-choose">从 SoFinder 插入图片</button><label class="action">上传图片<input hidden type="file" accept="image/*" id="tiptap-upload"></label></div><div id="tiptap-editor"></div><p class="status" id="tiptap-status"></p></div>
    <div class="pane" id="quill"><h2>Quill 2</h2><div id="quill-editor"><p>点击 Quill 工具栏的图片按钮选择 SoFinder 图片。</p></div><p class="status" id="quill-status"></p></div>
    <div class="pane" id="wangeditor"><h2>wangEditor 5</h2><div class="toolbar"><button class="action" id="wangeditor-choose">从 SoFinder 插入图片</button></div><div id="wangeditor-shell"><div id="wangeditor-toolbar"></div><div id="wangeditor-editor"></div></div><p class="status" id="wangeditor-status"></p><p class="note">工具栏图片按钮、本地粘贴和拖入使用 SoFinder 上传；上方按钮打开资源选择器。</p></div>
    <div class="pane" id="jodit"><h2>Jodit 4</h2><div class="toolbar"><button class="action" id="jodit-choose">从 SoFinder 插入图片</button></div><textarea id="jodit-editor">可从 SoFinder 选择，也可以使用图片按钮上传、粘贴或拖入图片。</textarea><p class="status" id="jodit-status"></p><p class="note">Jodit 的原生图片上传入口使用 SoFinder 上传；上方按钮打开资源选择器。</p></div>
  </section>
</main>
<script type="module">
  import { registerQuill, registerTinyMce, selectForCkeditor5, selectForInput, selectForJodit, selectForTiptap, selectForWangEditor } from '/sofinder/assets/sofinder-picker.js';
  import { bindAssetInput } from '/sofinder/assets/sofinder-editors.js';
  import { createCkeditor5UploadPlugin } from '/sofinder/assets/sofinder-ckeditor5.js';
  import { createTinyMceUploadIntegration } from '/sofinder/assets/sofinder-tinymce.js';
  import { installTiptapUploads, uploadForTiptap } from '/sofinder/assets/sofinder-tiptap.js';
  import { installQuillUploads } from '/sofinder/assets/sofinder-quill.js';
  import { createWangEditorUploadIntegration } from '/sofinder/assets/sofinder-wangeditor.js';
  import { createJoditUploadIntegration } from '/sofinder/assets/sofinder-jodit.js';
  const baseUrl = '/sofinder/browser';
  // Keep every multipart request below PHP's common 2 MiB development default.
  // Production applications can raise their server limits and use larger chunks.
  const editorOptions = { apiBase: '/sofinder/api', csrfToken: __CSRF_TOKEN__, resource: 'Files', locale: 'zh-cn', conflictStrategy: 'ask', chunkThreshold: 1_500_000, chunkSize: 1_500_000, onTaskChange: task => task.status !== 'ready' && console.info('SoFinder upload', task.status, task.progress) };
  const imageOptions = { baseUrl, resource: 'Files', language: 'zh-cn', tools: 'common' };
  const status = (id, value) => document.getElementById(id).textContent = value ? `已选择：${value.name}` : '';
  document.querySelectorAll('[data-pane]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-pane]').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('.pane').forEach(pane => pane.classList.toggle('active', pane.id === button.dataset.pane));
  }));
  document.getElementById('plain-choose').addEventListener('click', async () => status('plain-status', await selectForInput(document.getElementById('file-url'), { baseUrl, kind: 'file', resource: 'Files' })));
  bindAssetInput(document.getElementById('plain-upload'), document.getElementById('file-url'), { ...editorOptions, onAssetReady: asset => status('plain-status', asset), onError: error => { document.getElementById('plain-status').textContent = `上传失败：${error.message}`; } });

  let ckeditor;
  try {
    ckeditor = await window.ClassicEditor.create(document.getElementById('ckeditor-editor'), { extraPlugins: [createCkeditor5UploadPlugin(editorOptions)], toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'link', 'uploadImage'] });
    document.getElementById('ckeditor-choose').addEventListener('click', async () => status('ckeditor-status', await selectForCkeditor5(ckeditor, imageOptions)));
  } catch (error) { document.getElementById('ckeditor-status').textContent = `CKEditor 初始化失败：${error.message}`; }

  registerTinyMce(window.tinymce, imageOptions);
  let tinyUploadHandler;
  window.tinymce.init({ selector: '#tinymce-editor', height: 280, base_url: 'https://cdn.jsdelivr.net/npm/tinymce@8.0.2', suffix: '.min', license_key: 'gpl', plugins: 'sofinder link lists image', toolbar: 'undo redo | bold italic | link image sofinder', setup: editor => { tinyUploadHandler = createTinyMceUploadIntegration(editor, editorOptions); }, images_upload_handler: (...args) => tinyUploadHandler(...args), automatic_uploads: true, paste_data_images: true, promotion: false });

  const [{ Editor }, { default: StarterKit }, { default: Image }] = await Promise.all([import('https://esm.sh/@tiptap/core@3.31.3'), import('https://esm.sh/@tiptap/starter-kit@3.31.3'), import('https://esm.sh/@tiptap/extension-image@3.31.3')]);
  const tiptap = new Editor({ element: document.getElementById('tiptap-editor'), extensions: [StarterKit, Image], content: '<p>在这里编辑内容，然后从 SoFinder 插入图片。</p>' });
  installTiptapUploads(tiptap, editorOptions);
  document.getElementById('tiptap-choose').addEventListener('click', async () => status('tiptap-status', await selectForTiptap(tiptap, imageOptions)));
  document.getElementById('tiptap-upload').addEventListener('change', async event => { const file = event.target.files?.[0]; if (file) status('tiptap-status', await uploadForTiptap(tiptap, file, editorOptions)); });

  const quill = new window.Quill('#quill-editor', { theme: 'snow', modules: { toolbar: [['bold', 'italic'], ['link', 'image']] } });
  registerQuill(quill, imageOptions);
  installQuillUploads(quill, { ...editorOptions, toolbarUpload: false });

  const wangEditor = window.wangEditor.createEditor({ selector: '#wangeditor-editor', html: '<p>可从 SoFinder 选择，也可以使用工具栏上传、粘贴或拖入图片。</p>', config: { MENU_CONF: { uploadImage: createWangEditorUploadIntegration(editorOptions) } } });
  window.wangEditor.createToolbar({ editor: wangEditor, selector: '#wangeditor-toolbar', config: {} });
  document.getElementById('wangeditor-choose').addEventListener('click', async () => status('wangeditor-status', await selectForWangEditor(wangEditor, imageOptions)));

  const jodit = window.Jodit.make('#jodit-editor', { height: 280, uploader: createJoditUploadIntegration(editorOptions) });
  document.getElementById('jodit-choose').addEventListener('click', async () => status('jodit-status', await selectForJodit(jodit, imageOptions)));
</script>
</body>
</html>
HTML;
        $html = str_replace('__CSRF_TOKEN__', json_encode($this->csrf->getToken('sofinder')->getValue(), JSON_THROW_ON_ERROR), $html);

        return new Response($html, headers: [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-store, private',
            'X-Content-Type-Options' => 'nosniff',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
        ]);
    }
}
