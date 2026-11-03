<script setup lang="ts">
import { ref } from 'vue'
import TopNav from './components/TopNav.vue'
import HomeView from './views/HomeView.vue'
import LearningCenter from './views/LearningCenter.vue'
import LearningPlayer from './components/LearningPlayer.vue'
import LearningPet from './components/LearningPet.vue'

const view = ref('home')

function goHome() {
  view.value = 'home'
  scrollTop()
}
function openLearning() {view.value='learning';scrollTop()}
function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <TopNav @home="goHome" />

  <main class="page">
    <HomeView v-if="view === 'home'" @learning="openLearning" />
    <LearningCenter v-else @back="goHome" />
  </main>

  <LearningPlayer />
  <LearningPet />

  <footer class="foot">
    稼先社区 AI 学习频道 · 视频课程首页 · 纯前端演示 · 已上架 56 个视频合集（基础 / 应用 / 开发 / 前沿）
  </footer>
</template>

<style scoped>
.page {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 18px 24px 0;
  min-height: 70vh;
}
.foot {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 24px;
  font-size: 12.5px;
  color: var(--muted);
  border-top: 1px solid var(--border);
}
</style>
