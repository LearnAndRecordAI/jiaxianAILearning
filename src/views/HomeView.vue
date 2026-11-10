<script setup lang="ts">
import { computed, ref } from 'vue'
import { useResources } from '../composables/useResources'
import { useUserState } from '../composables/useUserState'
import { statsFor } from '../utils/stats'
import HomeBanner from '../components/HomeBanner.vue'
import HomeToolbar from '../components/HomeToolbar.vue'
import CourseCard from '../components/CourseCard.vue'
import topics from '../data/topics.json'
import {previewCollections} from '../utils/collectionPreview.mjs'

const { home, resources } = useResources()
const { bookmarks } = useUserState()
const emit = defineEmits<{ (e: 'learning'): void }>()

const SORTS = ['fav', 'recommend', 'hot', 'new']
const expandedLayers = ref<string[]>([])
function toggleLayer(label:string) {
  expandedLayers.value = expandedLayers.value.includes(label) ? expandedLayers.value.filter(x=>x!==label) : [...expandedLayers.value,label]
}
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
      <section v-for="section in factorySections" :id="`factory-${section.label}`" :key="section.label" class="factory-section" :aria-label="section.label">
        <header class="section-heading">
          <h2>{{ section.label }}</h2>
          <button v-if="section.resources.length>4" class="view-all" :aria-expanded="expandedLayers.includes(section.label)" :aria-controls="`collections-${section.label}`" @click="toggleLayer(section.label)">{{ expandedLayers.includes(section.label)?'收起':'查看全部' }} <span aria-hidden="true">{{ expandedLayers.includes(section.label)?'⌃':'›' }}</span></button>
        </header>
        <div v-if="section.resources.length" :id="`collections-${section.label}`" class="factory-row">
          <CourseCard v-for="r in previewCollections(section.resources,expandedLayers.includes(section.label))" :key="r.id" :resource="r" compact />
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
.factory-section{padding:12px 0 16px;scroll-margin-top:90px}
.section-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:9px;min-height:26px}
.section-heading h2{font-size:18px;margin:0;color:var(--ink);line-height:1.25}
.view-all{border:1px solid var(--border);border-radius:8px;padding:6px 11px;background:var(--surface);color:var(--ink-2);font-size:12px;cursor:pointer;white-space:nowrap}
.view-all:hover{border-color:var(--accent-line);color:var(--accent-ink)}
.view-all span{margin-left:5px}
.factory-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;align-items:start}
.factory-row>*{min-width:0}
.section-empty{padding:24px;color:var(--muted);background:var(--surface);border:1px dashed var(--border-strong);border-radius:12px;font-size:14px;margin:0}
@media(max-width:620px){.factory-section{scroll-margin-top:75px;padding:10px 0 12px}.section-heading h2{font-size:16px}.factory-row{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}
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
