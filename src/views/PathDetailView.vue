<script setup lang="ts">
import { computed } from 'vue'
import type { LearningPath } from '../types'
import { useResources } from '../composables/useResources'
import { useUserState } from '../composables/useUserState'

const props = defineProps<{ path: LearningPath }>()
const emit = defineEmits<{ (e: 'back'): void }>()
const { resolvePath } = useResources()
const { isCompleted, toggleCompleted, pathProgress } = useUserState()

const items = computed(() => resolvePath(props.path))
const prog = computed(() => pathProgress(items.value))
const pct = computed(() => Math.round(prog.value.ratio * 100))

function open(url?: string) {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="detail">
    <button class="back" @click="emit('back')">‹ 返回路径列表</button>
    <div class="head">
      <span class="lv" :class="'l-' + path.level.toLowerCase()">{{ path.level }}</span>
      <h1>{{ path.title }}</h1>
    </div>
    <p class="meta">{{ path.audience }} · 目标：{{ path.goal }}</p>

    <div class="progwrap">
      <div class="bar"><span :style="{ width: pct + '%' }"></span></div>
      <span class="pnum">{{ prog.done }}/{{ prog.total }} · {{ pct }}%</span>
    </div>

    <ol class="steps">
      <li v-for="(r, i) in items" :key="r.id" :class="{ done: isCompleted(r.id) }">
        <button class="check" :aria-pressed="isCompleted(r.id)" @click="toggleCompleted(r.id)">
          {{ isCompleted(r.id) ? '✓' : i + 1 }}
        </button>
        <div class="info">
          <a v-if="r.url" class="t" :href="r.url" target="_blank" rel="noopener noreferrer">{{ r.title }}</a>
          <span v-else class="t no-link" @click="open(r.url)">{{ r.title }}</span>
          <div class="sub">
            <span class="lvtag" :class="'l-' + r.level.toLowerCase()">{{ r.level }}</span>
            <span>{{ r.platform }}</span>
            <span>{{ r.media === 'article' ? '📄 图文' : '▶ 视频' }}</span>
          </div>
        </div>
        <button class="mark" @click="toggleCompleted(r.id)">
          {{ isCompleted(r.id) ? '已学 ✓' : '标记学过' }}
        </button>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.detail {
  padding: 8px 0 50px;
  max-width: 780px;
}
.back {
  font-size: 13px;
  color: var(--accent-ink);
  background: none;
  border: 0;
  font-weight: 600;
  padding: 6px 0;
}
.back:hover {
  text-decoration: underline;
}
.head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 2px;
}
.lv,
.lvtag {
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
h1 {
  font-size: 24px;
  margin: 0;
}
.meta {
  font-size: 13.5px;
  color: var(--muted);
  margin: 4px 0 16px;
}
.progwrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.bar {
  flex: 1;
  height: 8px;
  border-radius: 5px;
  background: var(--surface-3);
  overflow: hidden;
}
.bar span {
  display: block;
  height: 100%;
  background: var(--accent);
  border-radius: 5px;
  transition: width 0.25s ease;
}
.pnum {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-ink);
  white-space: nowrap;
}
.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.steps li {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
}
.steps li.done {
  border-color: var(--accent-line);
  background: color-mix(in srgb, var(--accent-soft) 50%, var(--surface));
}
.check {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--border-strong);
  background: var(--surface);
  color: var(--muted);
  font-weight: 700;
  font-size: 13px;
  flex: none;
}
li.done .check {
  background: var(--accent);
  border-color: transparent;
  color: #fff;
}
.info {
  flex: 1;
  min-width: 0;
}
.t {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--ink);
  text-decoration: none;
}
a.t:hover {
  color: var(--accent-ink);
}
.t.no-link {
  color: var(--ink-2);
  cursor: default;
}
.info .sub {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}
.mark {
  flex: none;
  font-size: 12.5px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--ink-2);
}
li.done .mark {
  background: var(--accent-soft);
  border-color: var(--accent-line);
  color: var(--accent-ink);
  font-weight: 700;
}
@media (max-width: 560px) {
  .mark {
    display: none;
  }
}
</style>
