<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData, useRoute } from 'vitepress'

const repository = 'https://github.com/sohophp/sofinder'
const { lang, page } = useData()
const route = useRoute()
const answer = ref<'yes' | 'no' | null>(null)

const labels = computed(() => lang.value.startsWith('zh-Hant')
  ? { question: '這個頁面對你有幫助嗎？', yes: '有', no: '沒有', thanks: '感謝你的回饋。', edit: '在 GitHub 編輯', issue: '回報問題' }
  : lang.value.startsWith('zh')
    ? { question: '这个页面对你有帮助吗？', yes: '有', no: '没有', thanks: '感谢你的反馈。', edit: '在 GitHub 编辑', issue: '报告问题' }
    : { question: 'Was this page helpful?', yes: 'Yes', no: 'No', thanks: 'Thanks for the feedback.', edit: 'Edit on GitHub', issue: 'Report an issue' })

const editPath = computed(() => `${repository}/edit/main/docs/${page.value.relativePath}`)
const issuePath = computed(() => `${repository}/issues/new?title=${encodeURIComponent(`Docs: ${page.value.title}`)}&body=${encodeURIComponent(`Documentation page: https://sofinder.sohophp.app${route.path}`)}`)

function respond(value: 'yes' | 'no') {
  answer.value = value
  try { localStorage.setItem(`sofinder.docs.feedback:${route.path}`, value) } catch { /* Browser storage is optional. */ }
}
</script>

<template>
  <section class="sf-doc-feedback" aria-labelledby="sf-feedback-title">
    <div>
      <strong id="sf-feedback-title">{{ labels.question }}</strong>
      <span v-if="answer" role="status">{{ labels.thanks }}</span>
    </div>
    <div class="sf-doc-feedback__actions">
      <button type="button" :class="{ selected: answer === 'yes' }" @click="respond('yes')">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 10v10H4V10h3Zm3 10h7.2a2 2 0 0 0 2-1.6l1.2-6A2 2 0 0 0 18.4 10H15l.5-3.1A2.5 2.5 0 0 0 13 4.5L10 10v10Z"/></svg>{{ labels.yes }}
      </button>
      <button type="button" :class="{ selected: answer === 'no' }" @click="respond('no')">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 14V4H4v10h3Zm3-10h7.2a2 2 0 0 1 2 1.6l1.2 6a2 2 0 0 1-2 2.4H15l.5 3.1a2.5 2.5 0 0 1-2.5 2.4L10 14V4Z"/></svg>{{ labels.no }}
      </button>
      <span class="sf-feedback-divider" aria-hidden="true"></span>
      <a :href="editPath" target="_blank" rel="noopener noreferrer">{{ labels.edit }}</a>
      <a :href="issuePath" target="_blank" rel="noopener noreferrer">{{ labels.issue }}</a>
    </div>
  </section>
</template>
