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
      { text: 'Trademark release gate', link: '/trademark-clearance' },
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
      { text: '設定參考', link: '/zh-TW/configuration' },
      { text: '疑難排解', link: '/zh-TW/troubleshooting' },
    ],
  },
  {
    text: '功能與運維',
    items: [
      { text: 'S3 相容儲存', link: '/zh-TW/s3' },
      { text: '儲存 Adapter', link: '/zh-TW/storage-adapters' },
      { text: '圖片格式', link: '/zh-TW/image-formats' },
      { text: '維護模式', link: '/zh-TW/maintenance' },
      { text: '安全部署', link: '/zh-TW/security' },
      { text: '威脅模型', link: '/zh-TW/threat-model' },
    ],
  },
  {
    text: '參考資料',
    items: [
      { text: 'Console 命令', link: '/zh-TW/console-commands' },
      { text: 'HTTP API', link: '/zh-TW/http-api' },
      { text: 'PHP 契約', link: '/zh-TW/php-contracts' },
      { text: 'Plugin API', link: '/zh-TW/plugins' },
      { text: '版本與相容性', link: '/zh-TW/versioning' },
    ],
  },
  {
    text: '專案',
    items: [
      { text: '升級指南', link: '/zh-TW/upgrading' },
      { text: '更新紀錄', link: '/zh-TW/changelog' },
      { text: '發布流程', link: '/zh-TW/releasing' },
      { text: '原創性聲明', link: '/zh-TW/originality' },
      { text: '商標發布檢查', link: '/zh-TW/trademark-clearance' },
    ],
  },
]

const simplifiedChineseSidebar = [
  {
    text: '开始使用',
    items: [
      { text: 'SoFinder 简介', link: '/zh-CN/' },
      { text: '安装与快速开始', link: '/zh-CN/getting-started' },
      { text: 'Symfony 集成', link: '/zh-CN/symfony' },
      { text: '配置参考', link: '/zh-CN/configuration' },
      { text: '故障排查', link: '/zh-CN/troubleshooting' },
    ],
  },
  {
    text: '存储与运维',
    items: [
      { text: '存储适配器', link: '/zh-CN/storage-adapters' },
      { text: 'S3 兼容存储', link: '/zh-CN/s3' },
      { text: '图片格式', link: '/zh-CN/image-formats' },
      { text: '维护模式', link: '/zh-CN/maintenance' },
      { text: '生产安全', link: '/zh-CN/security' },
      { text: '威胁模型', link: '/zh-CN/threat-model' },
    ],
  },
  {
    text: '参考资料',
    items: [
      { text: 'Console 命令', link: '/zh-CN/console-commands' },
      { text: 'HTTP API', link: '/zh-CN/http-api' },
      { text: 'PHP 契约', link: '/zh-CN/php-contracts' },
      { text: 'Plugin API', link: '/zh-CN/plugins' },
      { text: '版本与兼容性', link: '/zh-CN/versioning' },
    ],
  },
  {
    text: '项目',
    items: [
      { text: '升级指南', link: '/zh-CN/upgrading' },
      { text: '更新日志', link: '/zh-CN/changelog' },
      { text: '发布流程', link: '/zh-CN/releasing' },
      { text: '原创性声明', link: '/zh-CN/originality' },
      { text: '商标发布检查', link: '/zh-CN/trademark-clearance' },
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
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-Hans',
      link: '/zh-CN/',
      title: 'SoFinder',
      description: '适用于 PHP 与 Symfony 应用程序的安全 Web 文件管理器。',
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'SoFinder',
    search: {
      provider: 'local',
      options: {
        locales: {
          'zh-TW': {
            translations: {
              button: { buttonText: '搜尋文件', buttonAriaLabel: '搜尋文件' },
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
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
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
      },
      'zh-CN': {
        nav: [
          { text: '开始使用', link: '/zh-CN/getting-started' },
          { text: 'Symfony', link: '/zh-CN/symfony' },
          { text: '存储', link: '/zh-CN/storage-adapters' },
          { text: '安全', link: '/zh-CN/security' },
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
      },
    },
  },
})
