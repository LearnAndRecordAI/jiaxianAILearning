<script setup lang="ts">
import { computed } from 'vue'
import type { LearningPath } from '../types'
import { resources } from '../data/resources'
import { useUserState } from '../composables/useUserState'
import { useResources } from '../composables/useResources'
import CourseCard from './CourseCard.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'openPath', path: LearningPath): void }>()

const { bookmarks, completedCount, bookmarkCount, inProgressPaths } = useUserState()
const { paths, resolvePath } = useResources()

const bookmarked = computed(() => resources.filter((r) => bookmarks.has(r.id)))
const ongoing = computed(() => inProgressPaths(paths, resolvePath))
</script>

<template>
  <transition name="drawer">
    <div v-if="open" class="scrim" @click.self="emit('close')">
      <aside class="drawer" role="dialog" aria-label="我的学习">
        <header class="dh">
          <h2>我的学习</h2>
          <button class="x" @click="emit('close')" aria-label="关闭">✕</button>
        </header>

        <div class="stats">
          <div class="stat"><span class="n">{{ bookmarkCount }}</span><span class="l">收藏</span></div>
          <div class="stat"><span class="n">{{ completedCount }}</span><span class="l">学过</span></div>
          <div class="stat"><span class="n">{{ ongoing.length }}</span><span class="l">进行中路径</span></div>
        </div>

        <section v-if="ongoing.length" class="sec">
          <h3>进行中的学习路径</h3>
          <button v-for="o in ongoing" :key="o.path.id" class="pline" @click="emit('openPath', o.path)">
            <div class="pl-top">
              <span class="pl-title">{{ o.path.title }}</span>
              <span class="pl-pct">{{ Math.round(o.prog.ratio * 100) }}%</span>
            </div>
            <div class="pl-bar"><span :style="{ width: Math.round(o.prog.ratio * 100) + '%' }"></span></div>
          </button>
        </section>

        <section class="sec">
          <h3>我的收藏 ({{ bookmarked.length }})</h3>
          <div v-if="bookmarked.length" class="grid">
            <CourseCard v-for="r in bookmarked" :key="r.id" :resource="r" />
          </div>
          <p v-else class="empty">还没有收藏。在课程卡片上点「♡ 收藏」试试。</p>
        </section>
      </aside>
    </div>
  </transition>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(20, 14, 32, 0.42);
  display: flex;
  justify-content: flex-end;
  z-index: 50;
}
.drawer {
  width: min(460px, 100%);
  height: 100%;
  background: var(--ground);
  border-left: 1px solid var(--border);
  overflow-y: auto;
  padding: 18px 20px 40px;
  box-shadow: -10px 0 40px -20px rgba(0, 0, 0, 0.4);
}
.dh {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: -18px;
  background: var(--ground);
  padding-top: 4px;
  margin: -4px 0 8px;
}
.dh h2 {
  font-size: 20px;
  margin: 0;
}
.x {
  border: 0;
  background: var(--surface-2);
  color: var(--ink-2);
  width: 30px;
  height: 30px;
  border-radius: 8px;
  font-size: 14px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 12px 0 18px;
}
.stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}
.stat .n {
  display: block;
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 800;
  color: var(--accent-ink);
}
.stat .l {
  font-size: 12px;
  color: var(--muted);
}
.sec {
  margin-top: 18px;
}
.sec h3 {
  font-size: 14px;
  margin: 0 0 10px;
}
.pline {
  display: block;
  width: 100%;
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.pline:hover {
  border-color: var(--accent-line);
}
.pl-top {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 6px;
}
.pl-title {
  font-weight: 700;
  color: var(--ink);
}
.pl-pct {
  font-family: var(--font-mono);
  color: var(--accent-ink);
  font-weight: 700;
}
.pl-bar {
  height: 5px;
  border-radius: 3px;
  background: var(--surface-3);
  overflow: hidden;
}
.pl-bar span {
  display: block;
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.empty {
  font-size: 13px;
  color: var(--muted);
  background: var(--surface);
  border: 1px dashed var(--border-strong);
  border-radius: 10px;
  padding: 16px;
  text-align: center;
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 0.22s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(100%);
}
@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
