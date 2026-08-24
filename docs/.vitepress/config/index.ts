import { defineConfig } from 'vitepress'

const repository = 'https://github.com/sohophp/sofinder'

const englishSidebar = [
  {
    text: 'Get started',
    items: [
      { text: 'Introduction', link: '/' },
      { text: 'Installation', link: '/getting-started' },
      { text: 'Symfony integration', link: '/symfony' },
      { text: 'Configuration', link: '/configuration' },
      { text: 'Troubleshooting', link: '/troubleshooting' },
    ],
  },
  {
    text: 'Storage and operations',
    items: [
      { text: 'Storage adapters', link: '/storage-adapters' },
      { text: 'S3-compatible storage', link: '/s3' },
      { text: 'Image formats', link: '/image-formats' },
      { text: 'Maintenance', link: '/maintenance' },
    ],
  },
  {
    text: 'Security',
    items: [
      { text: 'Security guide', link: '/security' },
      { text: 'Threat model', link: '/threat-model' },
      { text: 'Security policy', link: `${repository}/security/policy` },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Console commands', link: '/console-commands' },
      { text: 'HTTP API', link: '/http-api' },
      { text: 'PHP contracts', link: '/php-contracts' },
      { text: 'Plugin API', link: '/plugins' },
      { text: 'Versioning', link: '/versioning' },
    ],
  },
  {
    text: 'Project',
    items: [
      { text: 'Upgrade guide', link: '/upgrading' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'Release process', link: '/releasing' },
      { text: 'Originality', link: '/originality' },
    ],
  },
]

const traditionalChineseSidebar = [
  {
    text: '開始使用',
    items: [
      { text: 'SoFinder 簡介', link: '/zh-TW/' },
      { text: '安裝與快速開始', link: '/zh-TW/getting-started' },
      { text: 'Symfony 整合', link: '/zh-TW/symfony' },
    ],
  },
  {
    text: '功能與運維',
    items: [
      { text: 'S3 相容儲存', link: '/zh-TW/s3' },
      { text: '圖片格式', link: '/zh-TW/image-formats' },
      { text: '維護模式', link: '/zh-TW/maintenance' },
      { text: '安全部署', link: '/zh-TW/security' },
    ],
  },
  {
    text: '英文參考資料',
    items: [
      { text: '完整設定參考', link: '/configuration' },
      { text: 'HTTP API', link: '/http-api' },
      { text: 'PHP 契約', link: '/php-contracts' },
      { text: '升級指南', link: '/upgrading' },
    ],
  },
]

export default defineConfig({
  title: 'SoFinder',
  description: 'A secure, framework-friendly web file manager for PHP and Symfony applications.',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['**/*.zh-TW.md'],
  markdown: {
    theme: {
      light: 'github-light-high-contrast',
      dark: 'github-dark-high-contrast',
    },
  },
  sitemap: {
    hostname: 'https://sofinder.sohophp.app',
  },
  transformHead({ pageData }) {
    const route = pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '')
    const canonical = `https://sofinder.sohophp.app/${route}`

    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:title', content: pageData.title || 'SoFinder' }],
      ['meta', { property: 'og:url', content: canonical }],
    ]
  },
  transformHtml(code) {
    return code.replace('<div class="VPContent is-home', '<div role="main" class="VPContent is-home')
  },
  head: [
    ['meta', { name: 'theme-color', content: '#1967d2' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'SoFinder Documentation' }],
    ['meta', { property: 'og:image', content: 'https://sofinder.sohophp.app/social-card.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'SoFinder',
      description: 'A secure, framework-friendly web file manager for PHP and Symfony applications.',
    },
    'zh-TW': {
      label: '繁體中文',
      lang: 'zh-Hant',
      link: '/zh-TW/',
      title: 'SoFinder',
      description: '適用於 PHP 與 Symfony 應用程式的安全 Web 檔案管理器。',
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'SoFinder',
    search: {
      provider: 'local',
    },
    socialLinks: [{ icon: 'github', link: repository }],
    editLink: {
      pattern: `${repository}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub',
    },
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
    outline: { level: [2, 3], label: 'On this page' },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © SohoPHP contributors',
    },
    locales: {
      root: {
        nav: [
          { text: 'Guide', link: '/getting-started', activeMatch: '^/(getting-started|symfony|configuration|troubleshooting)' },
          { text: 'Storage', link: '/storage-adapters', activeMatch: '^/(storage-adapters|s3|image-formats|maintenance)' },
          { text: 'Security', link: '/security', activeMatch: '^/(security|threat-model)' },
          { text: 'Reference', link: '/http-api', activeMatch: '^/(http-api|php-contracts|plugins|console-commands)' },
          { text: 'Releases', link: '/changelog' },
        ],
        sidebar: englishSidebar,
      },
      'zh-TW': {
        nav: [
          { text: '開始使用', link: '/zh-TW/getting-started' },
          { text: 'Symfony', link: '/zh-TW/symfony' },
          { text: '儲存', link: '/zh-TW/s3' },
          { text: '安全', link: '/zh-TW/security' },
          { text: 'GitHub', link: repository },
        ],
        sidebar: traditionalChineseSidebar,
        editLink: {
          pattern: `${repository}/edit/main/docs/:path`,
          text: '在 GitHub 編輯此頁',
        },
        lastUpdated: { text: '最後更新' },
        outline: { level: [2, 3], label: '本頁內容' },
        footer: {
          message: '依 MIT 授權條款發布。',
          copyright: 'Copyright © SohoPHP contributors',
        },
      },
    },
  },
})
