<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const label = computed(() => lang.value.startsWith('zh-Hant')
  ? 'MIT 授權'
  : lang.value.startsWith('zh') ? 'MIT 许可' : 'MIT Licensed')
</script>

<template>
  <div class="sf-license-badge">
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
    {{ label }}
  </div>
</template>
