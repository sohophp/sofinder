<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import CodePanel from './CodePanel.vue'

const { lang } = useData()
const labels = computed(() => lang.value.startsWith('zh-Hant')
  ? { eyebrow: '幾秒內完成安裝', copy: '複製安裝指令', copied: '已複製', note: '持續開發 · MIT 授權 · PHP 8.2+' }
  : lang.value.startsWith('zh')
    ? { eyebrow: '几秒内完成安装', copy: '复制安装命令', copied: '已复制', note: '持续开发 · MIT 许可 · PHP 8.2+' }
    : { eyebrow: 'Install in seconds', copy: 'Copy install command', copied: 'Copied', note: 'Actively developed · MIT licensed · PHP 8.2+' })
</script>

<template>
  <div class="sf-hero-terminal">
    <div class="sf-hero-terminal__glow" aria-hidden="true"></div>
    <div class="sf-hero-terminal__heading">
      <span class="sf-terminal-dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span>{{ labels.eyebrow }}</span>
    </div>
    <CodePanel
      code="composer require sohophp/sofinder-symfony:^1.1"
      language="Composer"
      :copy-label="labels.copy"
      :copied-label="labels.copied"
    />
    <div class="sf-hero-terminal__meta">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg>
      <span>{{ labels.note }}</span>
    </div>
  </div>
</template>
