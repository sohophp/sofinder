<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const repository = 'https://github.com/sohophp/sofinder'
const { lang } = useData()
const prefix = computed(() => lang.value.startsWith('zh-Hant') ? '/zh-TW' : lang.value.startsWith('zh') ? '/zh-CN' : '')
const labels = computed(() => lang.value.startsWith('zh-Hant')
  ? { description: '適用於 PHP 與 Symfony 的安全檔案管理。', resources: '資源', docs: '文件', guides: '使用指南', api: 'API 參考', community: '社群', issues: 'Issues', discussions: 'Discussions', project: '專案', changelog: '更新紀錄', security: '安全', contributing: '參與貢獻', license: '授權', message: '依 MIT 授權條款發布。', openSource: 'GitHub 上的開放原始碼', follow: '關注開發進度、回報問題並檢視每次發布。' }
  : lang.value.startsWith('zh')
    ? { description: '适用于 PHP 与 Symfony 的安全文件管理。', resources: '资源', docs: '文档', guides: '使用指南', api: 'API 参考', community: '社区', issues: 'Issues', discussions: 'Discussions', project: '项目', changelog: '更新日志', security: '安全', contributing: '参与贡献', license: '许可证', message: '依据 MIT 许可证发布。', openSource: 'GitHub 上的开放源代码', follow: '关注开发进度、报告问题并检查每次发布。' }
    : { description: 'Secure file management for PHP and Symfony.', resources: 'Resources', docs: 'Docs', guides: 'Guides', api: 'API Reference', community: 'Community', issues: 'Issues', discussions: 'Discussions', project: 'Project', changelog: 'Changelog', security: 'Security', contributing: 'Contributing', license: 'License', message: 'Released under the MIT License.', openSource: 'Open source on GitHub', follow: 'Follow development, report issues and review every release.' })
</script>

<template>
  <footer class="sf-site-footer">
    <div class="sf-site-footer__inner">
      <div class="sf-footer-brand">
        <a :href="`${prefix}/`" aria-label="SoFinder home"><img src="/logo.svg" alt="" width="30" height="30"><strong>SoFinder</strong></a>
        <p>{{ labels.description }}<br>{{ labels.message }}</p>
      </div>
      <div class="sf-footer-column"><strong>{{ labels.resources }}</strong><a :href="`${prefix}/getting-started`">{{ labels.docs }}</a><a :href="`${prefix}/user-guide`">{{ labels.guides }}</a><a :href="`${prefix}/api-reference`">{{ labels.api }}</a></div>
      <div class="sf-footer-column"><strong>{{ labels.community }}</strong><a :href="repository">GitHub</a><a :href="`${repository}/issues`">{{ labels.issues }}</a><a :href="`${repository}/discussions`">{{ labels.discussions }}</a></div>
      <div class="sf-footer-column"><strong>{{ labels.project }}</strong><a :href="`${prefix}/changelog`">{{ labels.changelog }}</a><a :href="`${prefix}/security`">{{ labels.security }}</a><a :href="`${repository}/blob/main/CONTRIBUTING.md`">{{ labels.contributing }}</a><a :href="`${repository}/blob/main/LICENSE`">{{ labels.license }}</a></div>
      <aside class="sf-footer-star"><strong>{{ labels.openSource }}</strong><p>{{ labels.follow }}</p><a :href="repository"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.1-4.7-5A3.9 3.9 0 0 1 6.7 9c-.1-.3-.5-1.3.1-2.6 0 0 .9-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .6 1.3.2 2.3.1 2.6a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.7 5 .4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>GitHub <span aria-hidden="true">↗</span></a></aside>
    </div>
    <div class="sf-site-footer__bottom"><span>© SohoPHP contributors</span><span>{{ labels.message }}</span></div>
  </footer>
</template>
