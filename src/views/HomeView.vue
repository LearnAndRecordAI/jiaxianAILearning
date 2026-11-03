<script setup lang="ts">
import { computed } from 'vue'
import { useResources } from '../composables/useResources'
import { useUserState } from '../composables/useUserState'
import { statsFor } from '../utils/stats'
import HomeBanner from '../components/HomeBanner.vue'
import HomeToolbar from '../components/HomeToolbar.vue'
import CourseCard from '../components/CourseCard.vue'
import topics from '../data/topics.json'

const { home, resources } = useResources()
const { bookmarks } = useUserState()
const emit = defineEmits<{ (e: 'learning'): void }>()

const SORTS = ['fav', 'recommend', 'hot', 'new']

const list = computed(() => {
  const a = home.active
  let r = resources.slice()
  const topic = topics.find(t => t.id === home.topic)
  if (topic) r = r.filter(x => topic.resourceIds.includes(x.id))
  // 选中的是板块 → 只显示该板块（默认推荐序）
  if (!SORTS.includes(a)) r = r.filter((x) => x.board === a)
  if (a === 'fav') r = r.filter((x) => bookmarks.has(x.id))
  const q = home.query.trim().toLowerCase()
  if (q) r = r.filter((x) => x.title.toLowerCase().includes(q) || x.platform.toLowerCase().includes(q))
  if (a === 'hot') r.sort((x, y) => statsFor(y).viewsNum - statsFor(x).viewsNum)
  else if (a === 'new') r.reverse()
  else r.sort((x, y) => (y.recommended ? 1 : 0) - (x.recommended ? 1 : 0))
  return r
})

const emptyHint = computed(() =>
  home.active === 'fav' ? '还没有收藏。在课程卡片上点「♡ 收藏」试试。' : '当前筛选下没有内容，换个板块或清空搜索试试。',
)
</script>

<template>
  <div class="home">
    <HomeBanner />
    <HomeToolbar @learning="emit('learning')" />
    <div v-if="list.length" class="grid">
      <CourseCard v-for="r in list" :key="r.id" :resource="r" />
    </div>
    <p v-else class="empty">{{ emptyHint }}</p>
  </div>
</template>

<style scoped>
.home {
  padding-bottom: 40px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin: 16px 0 40px;
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 620px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
.empty {
  font-size: 14px;
  color: var(--muted);
  background: var(--surface);
  border: 1px dashed var(--border-strong);
  border-radius: 12px;
  padding: 34px;
  text-align: center;
  margin: 16px 0 40px;
}
</style>
