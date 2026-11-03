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
    resources: section.resourceIds.flatMap(id => list.value.filter(resource => resource.id === id)),
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
      <section v-for="(section, index) in factorySections" :id="`factory-${section.label}`" :key="section.label" class="factory-section" :aria-label="section.label">
        <header class="section-heading">
          <span class="section-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <h2>{{ section.label }}</h2>
          <span class="section-english">{{ section.title }}</span>
        </header>
        <div v-if="section.resources.length" class="factory-row">
          <CourseCard v-for="r in section.resources" :key="r.id" :resource="r" compact />
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
.factory-section{display:grid;grid-template-columns:160px minmax(0,1fr);gap:24px;padding:26px 0;border-bottom:1px solid var(--border);scroll-margin-top:90px}
.section-heading{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:10px;border-left:3px solid var(--accent);padding-left:16px}
.section-number{border-radius:7px;background:var(--accent);color:white;padding:3px 10px;font-size:15px;font-weight:700}
.section-heading h2{font-size:24px;margin:0;color:var(--ink);line-height:1.3}
.section-english{font-size:12px;color:var(--muted);overflow-wrap:anywhere}
.factory-row{display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 36px)/3);gap:18px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x proximity}
.factory-row>*{scroll-snap-align:start;min-width:0}
.section-empty{padding:24px;color:var(--muted);background:var(--surface);border:1px dashed var(--border-strong);border-radius:12px;font-size:14px;margin:0}
@media(max-width:900px){.factory-section{grid-template-columns:120px minmax(0,1fr);gap:16px}.factory-row{grid-auto-columns:calc((100% - 18px)/2)}}
@media(max-width:620px){.factory-section{display:block;scroll-margin-top:75px}.section-heading{flex-direction:row;align-items:center;margin-bottom:14px;gap:10px;padding-left:10px}.section-heading h2{font-size:18px}.section-english{font-size:10px}.factory-row{grid-auto-columns:78%;gap:12px}}
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
