<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: 'Security' })
</script>

<template>
  <aside class="sf-security-callout">
    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z"/><path d="M12 8v5m0 3h.01"/></svg>
    <div><strong>{{ title }}</strong><div><slot /></div></div>
  </aside>
</template>
