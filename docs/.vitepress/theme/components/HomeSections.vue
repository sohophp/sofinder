<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import CodePanel from './CodePanel.vue'

const { lang } = useData()

const content = computed(() => {
  if (lang.value.startsWith('zh-Hant')) return {
    quickEyebrow: '30 秒快速開始', quickTitle: '從安裝到第一個檔案瀏覽器', quickText: '三個步驟建立受 Symfony 授權保護的本機檔案資源。',
    steps: ['安裝', '設定儲存', '開啟 SoFinder'], open: '登入後前往', configLink: '/zh-TW/getting-started', configLabel: '閱讀完整安裝指南',
    storageEyebrow: '供應商無關', storageTitle: '在同一套 API 後選擇儲存', storageText: '先使用本機儲存，需要時再安裝獨立 S3 Adapter。核心不綁定任何雲端供應商。', storageLink: '/zh-TW/storage-adapters', storageLabel: '比較儲存選項',
    editorEyebrow: '編輯器整合', editorTitle: '選擇器與編輯器保持解耦', editorText: 'CKEditor、TinyMCE 或自訂編輯器只依賴公開 JS API；後端授權與儲存選擇保持一致。', editorLink: '/zh-TW/editor-integrations', editorLabel: '查看編輯器整合',
    flow: ['編輯器', 'SoFinder JS API', 'SoFinder 後端', '儲存'],
    trust: ['MIT 授權', 'PHP 8.2+', 'Symfony 6.4+', 'S3 相容', '開放原始碼'], copy: '複製', copied: '已複製',
  }
  if (lang.value.startsWith('zh')) return {
    quickEyebrow: '30 秒快速开始', quickTitle: '从安装到第一个文件浏览器', quickText: '三个步骤建立受 Symfony 授权保护的本机文件资源。',
    steps: ['安装', '配置存储', '打开 SoFinder'], open: '登录后访问', configLink: '/zh-CN/getting-started', configLabel: '阅读完整安装指南',
    storageEyebrow: '供应商无关', storageTitle: '在同一套 API 后选择存储', storageText: '先使用本机存储，需要时再安装独立 S3 Adapter。核心不绑定任何云服务商。', storageLink: '/zh-CN/storage-adapters', storageLabel: '比较存储选项',
    editorEyebrow: '编辑器集成', editorTitle: '选择器与编辑器保持解耦', editorText: 'CKEditor、TinyMCE 或自定义编辑器只依赖公开 JS API；后端授权与存储选择保持一致。', editorLink: '/zh-CN/editor-integrations', editorLabel: '查看编辑器集成',
    flow: ['编辑器', 'SoFinder JS API', 'SoFinder 后端', '存储'],
    trust: ['MIT 许可', 'PHP 8.2+', 'Symfony 6.4+', 'S3 兼容', '开放源代码'], copy: '复制', copied: '已复制',
  }
  return {
    quickEyebrow: '30-second quick start', quickTitle: 'From install to your first file browser', quickText: 'Create a Symfony-authorized local file resource in three focused steps.',
    steps: ['Install', 'Configure storage', 'Open SoFinder'], open: 'Visit after signing in', configLink: '/getting-started', configLabel: 'Read the complete installation guide',
    storageEyebrow: 'Provider-independent', storageTitle: 'Choose storage behind one API', storageText: 'Start locally, then add the independent S3 adapter when needed. The core stays free of cloud-vendor coupling.', storageLink: '/storage-adapters', storageLabel: 'Compare storage options',
    editorEyebrow: 'Editor integrations', editorTitle: 'Keep the picker editor-independent', editorText: 'CKEditor, TinyMCE and custom editors depend only on the public JavaScript API while authorization and storage remain consistent.', editorLink: '/editor-integrations', editorLabel: 'Explore editor integrations',
    flow: ['Editor', 'SoFinder JS API', 'SoFinder Backend', 'Storage'],
    trust: ['MIT Licensed', 'PHP 8.2+', 'Symfony 6.4+', 'S3 Compatible', 'Open Source'], copy: 'Copy', copied: 'Copied',
  }
})

const yaml = `so_finder:
  resources:
    Files:
      adapter: local
      root: '%kernel.project_dir%/var/files'
      delivery_mode: proxy
      roles: [ROLE_USER]`
</script>

<template>
  <div class="sf-home-sections">
    <section class="sf-home-section sf-quick-start" aria-labelledby="quick-start-title">
      <header class="sf-section-heading">
        <span>{{ content.quickEyebrow }}</span>
        <h2 id="quick-start-title">{{ content.quickTitle }}</h2>
        <p>{{ content.quickText }}</p>
      </header>
      <div class="sf-quick-grid">
        <article class="sf-step-card">
          <b>01</b><h3>{{ content.steps[0] }}</h3>
          <CodePanel code="composer require sohophp/sofinder:^0.1@beta" language="Bash" :copy-label="content.copy" :copied-label="content.copied" />
        </article>
        <article class="sf-step-card">
          <b>02</b><h3>{{ content.steps[1] }}</h3>
          <CodePanel :code="yaml" language="YAML" filename="config/packages/so_finder.yaml" :copy-label="content.copy" :copied-label="content.copied" />
        </article>
        <article class="sf-step-card sf-step-card--open">
          <b>03</b><h3>{{ content.steps[2] }}</h3>
          <div class="sf-browser-route"><span>{{ content.open }}</span><code>/sofinder/browser</code></div>
          <a :href="content.configLink">{{ content.configLabel }} <span aria-hidden="true">→</span></a>
        </article>
      </div>
    </section>

    <section class="sf-home-section sf-split-section" aria-labelledby="storage-title">
      <div class="sf-split-copy">
        <span>{{ content.storageEyebrow }}</span>
        <h2 id="storage-title">{{ content.storageTitle }}</h2>
        <p>{{ content.storageText }}</p>
        <a :href="content.storageLink">{{ content.storageLabel }} <span aria-hidden="true">→</span></a>
      </div>
      <div class="sf-provider-grid" aria-label="Storage providers">
        <div><i class="sf-provider-icon sf-provider-icon--local">L</i><span>Local Storage</span></div>
        <div><i class="sf-provider-icon sf-provider-icon--aws">S3</i><span>AWS S3</span></div>
        <div><i class="sf-provider-icon sf-provider-icon--r2">R2</i><span>Cloudflare R2</span></div>
        <div><i class="sf-provider-icon sf-provider-icon--minio">M</i><span>MinIO</span></div>
        <div class="sf-provider-wide"><i class="sf-provider-icon">+</i><span>Other S3-compatible providers</span></div>
      </div>
    </section>

    <section class="sf-home-section sf-editor-section" aria-labelledby="editor-title">
      <header class="sf-section-heading">
        <span>{{ content.editorEyebrow }}</span>
        <h2 id="editor-title">{{ content.editorTitle }}</h2>
        <p>{{ content.editorText }}</p>
      </header>
      <div class="sf-editor-products" aria-label="Supported editor integrations">
        <span>CKEditor 4</span><span>CKEditor 5</span><span>TinyMCE</span><span>Custom editor</span><span>Custom picker</span>
      </div>
      <div class="sf-integration-flow" aria-label="Editor integration flow">
        <template v-for="(item, index) in content.flow" :key="item">
          <div><b>{{ index + 1 }}</b><span>{{ item }}</span></div>
          <svg v-if="index < content.flow.length - 1" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>
        </template>
      </div>
      <a class="sf-section-link" :href="content.editorLink">{{ content.editorLabel }} <span aria-hidden="true">→</span></a>
    </section>

    <div class="sf-trust-bar" aria-label="Project facts">
      <span v-for="(item, index) in content.trust" :key="item"><i aria-hidden="true">{{ ['◇', '</>', 'Sf', '↗', '◉'][index] }}</i>{{ item }}</span>
    </div>
  </div>
</template>
