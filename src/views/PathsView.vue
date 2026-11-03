<script setup lang="ts">
import type { LearningPath } from '../types'
import { useResources } from '../composables/useResources'
import PathCard from '../components/PathCard.vue'

const emit = defineEmits<{ (e: 'back'): void; (e: 'open', p: LearningPath): void }>()
const { paths, resolvePath } = useResources()
</script>

<template>
  <div class="paths">
    <button class="back" @click="emit('back')">‹ 返回首页</button>
    <h1>学习路径</h1>
    <p class="sub">按角色和目标挑一条路径，边学边打卡——进度存在本地，随时接着学。</p>
    <div class="grid">
      <PathCard
        v-for="p in paths"
        :key="p.id"
        :path="p"
        :items="resolvePath(p)"
        @open="emit('open', p)"
      />
    </div>
  </div>
</template>

<style scoped>
.paths {
  padding: 8px 0 50px;
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
h1 {
  font-size: 26px;
  margin: 8px 0 4px;
}
.sub {
  font-size: 14px;
  color: var(--muted);
  margin: 0 0 20px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
