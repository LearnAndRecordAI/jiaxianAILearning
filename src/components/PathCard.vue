<script setup lang="ts">
import { computed } from 'vue'
import type { LearningPath, Resource } from '../types'
import { useUserState } from '../composables/useUserState'

const props = defineProps<{ path: LearningPath; items: Resource[] }>()
const emit = defineEmits<{ (e: 'open'): void }>()
const { pathProgress } = useUserState()

const prog = computed(() => pathProgress(props.items))
const pct = computed(() => Math.round(prog.value.ratio * 100))
</script>

<template>
  <button class="pcard" @click="emit('open')">
    <div class="top">
      <span class="lv" :class="'l-' + path.level.toLowerCase()">{{ path.level }}</span>
      <span class="aud">{{ path.audience }}</span>
    </div>
    <h3 class="pt">{{ path.title }}</h3>
    <p class="goal">{{ path.goal }}</p>
    <div class="bar">
      <span class="fill" :style="{ width: pct + '%' }"></span>
    </div>
    <div class="prog">
      <span>{{ prog.done }}/{{ prog.total }} 已学</span>
      <span class="pct">{{ pct }}%</span>
    </div>
  </button>
</template>

<style scoped>
.pcard {
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 17px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 7px;
  transition: transform 0.12s ease, border-color 0.12s ease;
  width: 100%;
}
.pcard:hover {
  transform: translateY(-2px);
  border-color: var(--accent-line);
}
.top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.lv {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  border-radius: 5px;
  padding: 1px 6px;
}
.l-l1 {
  background: var(--l1);
}
.l-l2 {
  background: var(--l2);
}
.l-l3 {
  background: var(--l3);
}
.l-l4 {
  background: var(--l4);
}
.l-l5 {
  background: var(--l5);
}
.aud {
  font-size: 12px;
  color: var(--muted);
}
.pt {
  font-size: 17px;
  font-weight: 800;
  margin: 0;
}
.goal {
  font-size: 13px;
  color: var(--ink-2);
  margin: 0;
}
.bar {
  height: 6px;
  border-radius: 4px;
  background: var(--surface-3);
  overflow: hidden;
  margin-top: 2px;
}
.fill {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: var(--accent);
  transition: width 0.25s ease;
}
.prog {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
}
.pct {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--accent-ink);
}
</style>
