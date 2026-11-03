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
const factorySections = computed(() => {
  if (home.topic !== 'ai-dc') return []
  const sections = topics.find(t => t.id === 'ai-dc')?.sections ?? []
  return sections.map(section => ({
    ...section,
    resources: list.value.filter(resource => section.resourceIds.includes(resource.id)),
  }))
})

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
    <div v-if="home.topic === 'ai-dc'" class="factory">
      <header class="factory-heading">
        <h1>AI算力工厂</h1>
        <p>从芯片到集群，看懂算、网、基、电、云、储</p>
      </header>
      <section v-for="section in factorySections" :key="section.label" class="factory-section" :aria-label="section.title">
        <header class="section-heading">
          <span class="section-symbol">{{ section.label }}</span>
          <h2>{{ section.title }}</h2>
          <span class="section-count">{{ section.resources.length }} 个合集</span>
        </header>
        <div v-if="section.resources.length" class="factory-row">
          <CourseCard v-for="r in section.resources" :key="r.id" :resource="r" />
        </div>
        <p v-else class="section-empty">{{ home.query ? '没有匹配的合集，试试其他关键词。' : '优质合集筹备中，敬请期待。' }}</p>
      </section>
    </div>
    <div v-else-if="list.length" class="grid">
      <CourseCard v-for="r in list" :key="r.id" :resource="r" />
    </div>
    <p v-else class="empty">{{ emptyHint }}</p>
  </div>
</template>

<style scoped>
.factory-heading{padding:24px 0 12px}
.factory-heading h1{font-size:26px;margin:0 0 8px;color:var(--ink)}
.factory-heading p{color:var(--muted);font-size:14px;margin:0}
.factory-section{padding:22px 0 28px;border-bottom:1px solid var(--border)}
.section-heading{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.section-symbol{display:grid;place-items:center;width:44px;height:44px;border-radius:13px;background:var(--surface-3);color:var(--accent-ink);border:1px solid var(--accent-line);font-size:23px;font-weight:700;flex:none}
.section-heading h2{font-size:18px;margin:0;color:var(--ink)}
.section-count{margin-left:auto;font-size:13px;color:var(--muted)}
.factory-row{display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 54px)/4);gap:18px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x proximity}
.factory-row>*{scroll-snap-align:start;min-width:0}
.section-empty{padding:24px;color:var(--muted);background:var(--surface);border:1px dashed var(--border-strong);border-radius:12px;font-size:14px;margin:0}
@media(max-width:900px){.factory-row{grid-auto-columns:calc((100% - 36px)/3)}}
@media(max-width:620px){.factory-row{grid-auto-columns:78%;gap:12px}.factory-heading h1{font-size:22px}.section-heading h2{font-size:16px}}
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
