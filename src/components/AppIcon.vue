<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })

// 24x24 线性图标（stroke=currentColor）。
const ICONS: Record<string, string> = {
  // —— 板块图标 ——
  lightbulb:
    '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.7c.5.4.8 1 .8 1.6v.2h6v-.2c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z"/>',
  wand: '<path d="M5 19 14.5 9.5"/><path d="m16 3 .9 2.1L19 6l-2.1.9L16 9l-.9-2.1L13 6l2.1-.9z"/><path d="M19.5 12.5v2M18.5 13.5h2"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>',
  radar:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12 19 7.5"/><path d="M12 3v3M21 12h-3"/>',
  // —— 封面主题图标 ——
  chat: '<path d="M4 5h16v10H9l-4 4v-4H4Z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>',
  doc: '<path d="M6 3h8l4 4v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v4h4M8 13h8M8 17h5"/>',
  rag: '<path d="M6 3h7l4 4v6"/><path d="M13 3v4h4"/><path d="M6 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5"/><circle cx="16" cy="16" r="3"/><path d="m18.5 18.5 2 2"/>',
  agent:
    '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 6h8M7.4 7.6 10.8 15.4M16.6 7.6 13.2 15.4"/>',
  network:
    '<circle cx="5" cy="7" r="1.7"/><circle cx="5" cy="17" r="1.7"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="7" r="1.7"/><circle cx="19" cy="17" r="1.7"/><path d="M6.6 7.8 10.3 11M6.6 16.2 10.3 13M13.7 11 17.4 7.8M13.7 13 17.4 16.2"/>',
  finetune: '<path d="M4 8h9M18 8h2M4 16h2M11 16h9"/><circle cx="15" cy="8" r="2.2"/><circle cx="8" cy="16" r="2.2"/>',
  server:
    '<rect x="4" y="4" width="16" height="7" rx="1.5"/><rect x="4" y="13" width="16" height="7" rx="1.5"/><path d="M7.5 7.5h.01M7.5 16.5h.01"/>',
  blueprint: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M9 4v16M9 14h6"/>',
  image:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="m4 17 5-4 4 3 3-2 4 3"/>',
  chart: '<path d="M4 4v16h16"/><path d="m7 14 3-3 3 2 5-6"/>',
}

const svg = computed(() => ICONS[props.name] ?? ICONS.lightbulb)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="svg"
  />
</template>
