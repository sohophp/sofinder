import { defineConfig } from 'vitepress'

const repository = 'https://github.com/sohophp/sofinder'

const englishSidebar = [
  {
    text: 'Getting started',
    collapsed: false,
    items: [
      { text: 'Introduction', link: '/' },
      { text: 'Installation', link: '/getting-started' },
      { text: 'Configuration', link: '/configuration' },
      { text: 'Upgrading', link: '/upgrading' },
      { text: 'Troubleshooting', link: '/troubleshooting' },
    ],
  },
  {
    text: 'User guide',
    collapsed: false,
    items: [
      { text: 'CMS editor quick guide', link: '/cms-user-guide' },
      { text: 'File manager user guide', link: '/user-guide' },
      { text: 'Managing images', link: '/image-guide' },
      { text: 'Image formats', link: '/image-formats' },
      { text: 'PDF and Office preview', link: '/document-preview' },
      { text: 'Maintenance', link: '/maintenance' },
      { text: 'Production operations', link: '/production' },
    ],
  },
  {
    text: 'Integrations',
    collapsed: true,
    items: [
      { text: 'Symfony', link: '/symfony' },
      { text: 'Framework integrations', link: '/framework-integrations' },
      { text: 'Framework support', link: '/framework-support' },
      { text: 'Package architecture', link: '/package-architecture' },
      { text: 'CKEditor 4', link: '/ckeditor4' },
      { text: 'Editor integrations', link: '/editor-integrations' },
      { text: 'Custom integration', link: '/developer-guide' },
    ],
  },
  {
    text: 'Storage',
    collapsed: true,
    items: [
      { text: 'Storage adapters', link: '/storage-adapters' },
      { text: 'S3-compatible storage', link: '/s3' },
    ],
  },
  {
    text: 'Security',
    collapsed: true,
    items: [
      { text: 'Security guide', link: '/security' },
      { text: 'Threat model', link: '/threat-model' },
      { text: 'Security policy', link: `${repository}/security/policy` },
    ],
  },
  {
    text: 'Reference',
    collapsed: true,
    items: [
      { text: 'Console commands', link: '/console-commands' },
      { text: 'HTTP API reference', link: '/api-reference' },
      { text: 'HTTP API stability', link: '/http-api' },
      { text: 'PHP contracts', link: '/php-contracts' },
      { text: 'Plugin API', link: '/plugins' },
    ],
  },
  {
    text: 'Project',
    collapsed: true,
    items: [
      { text: 'Changelog', link: '/changelog' },
      { text: 'Versioning', link: '/versioning' },
      { text: 'Release process', link: '/releasing' },
      { text: 'Originality', link: '/originality' },
      { text: 'Trademark release gate', link: '/trademark-clearance' },
    ],
  },
]

const traditionalChineseSidebar = [
  {
    text: '開始使用',
    collapsed: false,
    items: [
      { text: 'SoFinder 簡介', link: '/zh-TW/' },
      { text: '安裝與快速開始', link: '/zh-TW/getting-started' },
      { text: '設定參考', link: '/zh-TW/configuration' },
      { text: '升級指南', link: '/zh-TW/upgrading' },
      { text: '疑難排解', link: '/zh-TW/troubleshooting' },
    ],
  },
  {
    text: '使用指南',
    collapsed: false,
    items: [
      { text: 'CMS 內容編輯快速指南', link: '/zh-TW/cms-user-guide' },
      { text: '檔案管理器使用指南', link: '/zh-TW/user-guide' },
      { text: '圖片管理', link: '/zh-TW/image-guide' },
      { text: '圖片格式', link: '/zh-TW/image-formats' },
      { text: 'PDF 與 Office 預覽', link: '/zh-TW/document-preview' },
      { text: '維護模式', link: '/zh-TW/maintenance' },
      { text: '正式環境與多節點', link: '/zh-TW/production' },
    ],
  },
  {
    text: '整合',
    collapsed: true,
    items: [
      { text: 'Symfony 整合', link: '/zh-TW/symfony' },
      { text: '框架整合', link: '/zh-TW/framework-integrations' },
      { text: '框架支援', link: '/zh-TW/framework-support' },
      { text: 'Package 架構', link: '/zh-TW/package-architecture' },
      { text: 'CKEditor 4', link: '/zh-TW/ckeditor4' },
      { text: '主流編輯器整合', link: '/zh-TW/editor-integrations' },
      { text: '自訂整合', link: '/zh-TW/developer-guide' },
    ],
  },
  {
    text: '儲存',
    collapsed: true,
    items: [
      { text: '儲存 Adapter', link: '/zh-TW/storage-adapters' },
      { text: 'S3 相容儲存', link: '/zh-TW/s3' },
    ],
  },
  {
    text: '安全',
    collapsed: true,
    items: [
      { text: '安全部署', link: '/zh-TW/security' },
      { text: '威脅模型', link: '/zh-TW/threat-model' },
      { text: '安全政策', link: `${repository}/security/policy` },
    ],
  },
  {
    text: '參考資料',
    collapsed: true,
    items: [
      { text: 'Console 命令', link: '/zh-TW/console-commands' },
      { text: 'HTTP API 參考', link: '/zh-TW/api-reference' },
      { text: 'HTTP API 相容性', link: '/zh-TW/http-api' },
      { text: 'PHP 契約', link: '/zh-TW/php-contracts' },
      { text: 'Plugin API', link: '/zh-TW/plugins' },
    ],
  },
  {
    text: '專案',
    collapsed: true,
    items: [
      { text: '更新紀錄', link: '/zh-TW/changelog' },
      { text: '版本與相容性', link: '/zh-TW/versioning' },
      { text: '發布流程', link: '/zh-TW/releasing' },
      { text: '原創性聲明', link: '/zh-TW/originality' },
      { text: '商標發布檢查', link: '/zh-TW/trademark-clearance' },
    ],
  },
]

const simplifiedChineseSidebar = [
  {
    text: '开始使用',
    collapsed: false,
    items: [
      { text: 'SoFinder 简介', link: '/zh-CN/' },
      { text: '安装与快速开始', link: '/zh-CN/getting-started' },
      { text: '配置参考', link: '/zh-CN/configuration' },
      { text: '升级指南', link: '/zh-CN/upgrading' },
      { text: '故障排查', link: '/zh-CN/troubleshooting' },
    ],
  },
  {
    text: '使用指南',
    collapsed: false,
    items: [
      { text: 'CMS 内容编辑快速指南', link: '/zh-CN/cms-user-guide' },
      { text: '文件管理器使用指南', link: '/zh-CN/user-guide' },
      { text: '图片管理', link: '/zh-CN/image-guide' },
      { text: '图片格式', link: '/zh-CN/image-formats' },
      { text: 'PDF 与 Office 预览', link: '/zh-CN/document-preview' },
      { text: '维护模式', link: '/zh-CN/maintenance' },
      { text: '生产与多节点', link: '/zh-CN/production' },
    ],
  },
  {
    text: '集成',
    collapsed: true,
    items: [
      { text: 'Symfony 集成', link: '/zh-CN/symfony' },
      { text: '框架集成', link: '/zh-CN/framework-integrations' },
      { text: '框架支持', link: '/zh-CN/framework-support' },
      { text: '包架构', link: '/zh-CN/package-architecture' },
      { text: 'CKEditor 4', link: '/zh-CN/ckeditor4' },
      { text: '主流编辑器集成', link: '/zh-CN/editor-integrations' },
      { text: '自定义集成', link: '/zh-CN/developer-guide' },
    ],
  },
  {
    text: '存储',
    collapsed: true,
    items: [
      { text: '存储适配器', link: '/zh-CN/storage-adapters' },
      { text: 'S3 兼容存储', link: '/zh-CN/s3' },
    ],
  },
  {
    text: '安全',
    collapsed: true,
    items: [
      { text: '生产安全', link: '/zh-CN/security' },
      { text: '威胁模型', link: '/zh-CN/threat-model' },
      { text: '安全政策', link: `${repository}/security/policy` },
    ],
  },
  {
    text: '参考资料',
    collapsed: true,
    items: [
      { text: 'Console 命令', link: '/zh-CN/console-commands' },
      { text: 'HTTP API 参考', link: '/zh-CN/api-reference' },
      { text: 'HTTP API 兼容性', link: '/zh-CN/http-api' },
      { text: 'PHP 契约', link: '/zh-CN/php-contracts' },
      { text: 'Plugin API', link: '/zh-CN/plugins' },
    ],
  },
  {
    text: '项目',
    collapsed: true,
    items: [
      { text: '更新日志', link: '/zh-CN/changelog' },
      { text: '版本与兼容性', link: '/zh-CN/versioning' },
      { text: '发布流程', link: '/zh-CN/releasing' },
      { text: '原创性声明', link: '/zh-CN/originality' },
      { text: '商标发布检查', link: '/zh-CN/trademark-clearance' },
    ],
  },
]

const traditionalChineseTheme = {
  nav: [
    { text: '文件', link: '/zh-TW/getting-started', activeMatch: '^/zh-TW/(getting-started|configuration|symfony|framework-integrations|framework-support|package-architecture|storage-adapters|s3|security|production|maintenance)' },
    { text: '指南', link: '/zh-TW/cms-user-guide', activeMatch: '^/zh-TW/(cms-user-guide|user-guide|image-guide|image-formats|document-preview|editor-integrations|ckeditor4)' },
    { text: 'API', link: '/zh-TW/api-reference', activeMatch: '^/zh-TW/(api-reference|http-api|php-contracts|plugins|developer-guide|console-commands)' },
    { text: 'GitHub', link: repository },
  ],
  sidebar: traditionalChineseSidebar,
  darkModeSwitchLabel: '外觀',
  lightModeSwitchTitle: '切換為淺色主題',
  darkModeSwitchTitle: '切換為深色主題',
  sidebarMenuLabel: '選單',
  returnToTopLabel: '回到頂端',
  langMenuLabel: '切換語言',
  skipToContentLabel: '跳至內容',
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
}

const simplifiedChineseTheme = {
  nav: [
    { text: '文档', link: '/zh-CN/getting-started', activeMatch: '^/zh-CN/(getting-started|configuration|symfony|framework-integrations|framework-support|package-architecture|storage-adapters|s3|security|production|maintenance)' },
    { text: '指南', link: '/zh-CN/cms-user-guide', activeMatch: '^/zh-CN/(cms-user-guide|user-guide|image-guide|image-formats|document-preview|editor-integrations|ckeditor4)' },
    { text: 'API', link: '/zh-CN/api-reference', activeMatch: '^/zh-CN/(api-reference|http-api|php-contracts|plugins|developer-guide|console-commands)' },
    { text: 'GitHub', link: repository },
  ],
  sidebar: simplifiedChineseSidebar,
  darkModeSwitchLabel: '外观',
  lightModeSwitchTitle: '切换为浅色主题',
  darkModeSwitchTitle: '切换为深色主题',
  sidebarMenuLabel: '菜单',
  returnToTopLabel: '返回顶部',
  langMenuLabel: '切换语言',
  skipToContentLabel: '跳到内容',
  editLink: {
    pattern: `${repository}/edit/main/docs/:path`,
    text: '在 GitHub 编辑此页',
  },
  lastUpdated: { text: '最后更新' },
  outline: { level: [2, 3], label: '本页内容' },
  footer: {
    message: '依据 MIT 许可证发布。',
    copyright: 'Copyright © SohoPHP contributors',
  },
}

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
    const localizedRoute = route.replace(/^(zh-TW|zh-CN)\//, '')
    const locale = route.startsWith('zh-TW/') ? 'zh-TW' : route.startsWith('zh-CN/') ? 'zh-CN' : 'en'
    const localizedUrl = (prefix: string) =>
      `https://sofinder.sohophp.app/${prefix}${localizedRoute}`

    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['link', { rel: 'alternate', hreflang: 'en', href: localizedUrl('') }],
      ['link', { rel: 'alternate', hreflang: 'zh-Hans', href: localizedUrl('zh-CN/') }],
      ['link', { rel: 'alternate', hreflang: 'zh-Hant', href: localizedUrl('zh-TW/') }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: localizedUrl('') }],
      ['meta', { property: 'og:title', content: pageData.title || 'SoFinder' }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:locale', content: locale.replace('-', '_') }],
    ]
  },
  transformHtml(code) {
    return code.replace('<div class="VPContent is-home', '<div role="main" class="VPContent is-home')
  },
  head: [
    ['meta', { name: 'theme-color', content: '#4f46e5' }],
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
      themeConfig: traditionalChineseTheme,
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-Hans',
      link: '/zh-CN/',
      title: 'SoFinder',
      description: '适用于 PHP 与 Symfony 应用程序的安全 Web 文件管理器。',
      themeConfig: simplifiedChineseTheme,
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'SoFinder',
    nav: [
      { text: 'Docs', link: '/getting-started', activeMatch: '^/(getting-started|configuration|symfony|framework-integrations|framework-support|package-architecture|storage-adapters|s3|security|production|maintenance)' },
      { text: 'Guides', link: '/cms-user-guide', activeMatch: '^/(cms-user-guide|user-guide|image-guide|image-formats|document-preview|editor-integrations|ckeditor4)' },
      { text: 'API', link: '/api-reference', activeMatch: '^/(api-reference|http-api|php-contracts|plugins|developer-guide|console-commands)' },
      { text: 'GitHub', link: repository },
    ],
    sidebar: englishSidebar,
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: { buttonText: 'Search documentation...', buttonAriaLabel: 'Search documentation' },
          modal: { noResultsText: 'No documentation results found' },
        },
        locales: {
          'zh-TW': {
            translations: {
              button: { buttonText: '搜尋文件…', buttonAriaLabel: '搜尋文件' },
              modal: {
                displayDetails: '顯示詳細清單',
                resetButtonTitle: '清除查詢',
                backButtonTitle: '關閉搜尋',
                noResultsText: '找不到相關結果',
                footer: {
                  selectText: '選取',
                  selectKeyAriaLabel: 'Enter 鍵',
                  navigateText: '切換',
                  navigateUpKeyAriaLabel: '向上鍵',
                  navigateDownKeyAriaLabel: '向下鍵',
                  closeText: '關閉',
                  closeKeyAriaLabel: 'Escape 鍵',
                },
              },
            },
          },
          'zh-CN': {
            translations: {
              button: { buttonText: '搜索文档…', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除查询',
                backButtonTitle: '关闭搜索',
                noResultsText: '找不到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: 'Enter 键',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '向上键',
                  navigateDownKeyAriaLabel: '向下键',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Escape 键',
                },
              },
            },
          },
        },
      },
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
  },
})
