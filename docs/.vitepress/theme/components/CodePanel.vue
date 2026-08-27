<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  code: string
  language: string
  filename?: string
  copyLabel?: string
  copiedLabel?: string
}>(), {
  filename: '',
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
})

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 1600)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="sf-code-panel">
    <div class="sf-code-panel__bar">
      <span class="sf-code-panel__language">{{ language }}</span>
      <span v-if="filename" class="sf-code-panel__filename">{{ filename }}</span>
      <button type="button" class="sf-code-panel__copy" :aria-label="copyLabel" @click="copyCode">
        <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
        <span>{{ copied ? copiedLabel : copyLabel }}</span>
      </button>
    </div>
    <pre tabindex="0"><code>{{ code }}</code></pre>
  </div>
</template>
