<script setup lang="ts">
import type { Difficulty } from '../types'
defineProps<{ difficulty: Difficulty; reason?: string }>()
</script>

<template>
  <span class="difficulty-tag" :data-difficulty="difficulty" :title="reason">#{{ difficulty }}</span>
</template>

<style scoped>
.difficulty-tag{display:inline-block;flex:none;white-space:nowrap;font-size:11px;font-weight:500;line-height:1.5;padding:1px 5px;border:1px solid currentColor;border-radius:4px;vertical-align:middle;color:var(--accent-ink);background:var(--surface-2)}
.difficulty-tag[data-difficulty="入门"]{color:#329b7c}
.difficulty-tag[data-difficulty="进阶"]{color:#a17be0}
</style>
