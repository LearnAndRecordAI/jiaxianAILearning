import { reactive, computed } from 'vue'
import type { Board, Filters, HomeActive, LearningPath, Level, Media, Region, Resource } from '../types'
import { resources } from '../data/resources'
import { paths } from '../data/paths'

// 全局单例：筛选状态 + 过滤后的资源。

const filters = reactive<Filters>({
  levels: [],
  media: null,
  region: null,
  query: '',
})

// 首页工具行状态：active 为单选（排序 tab 或 板块，互斥）+ 搜索，跨组件共享。
const home = reactive({
  active: 'recommend' as HomeActive,
  query: '',
  topic: '',
})

const ALL_LEVELS: Level[] = ['L1', 'L2', 'L3', 'L4', 'L5']

function matches(r: Resource): boolean {
  if (filters.levels.length && !filters.levels.includes(r.level)) return false
  if (filters.media) {
    if (filters.media === 'video' && r.media === 'article') return false
    if (filters.media === 'article' && r.media === 'video') return false
  }
  if (filters.region) {
    if (filters.region === 'cn' && r.region === 'overseas') return false
    if (filters.region === 'overseas' && r.region === 'cn') return false
  }
  if (filters.query.trim()) {
    const q = filters.query.trim().toLowerCase()
    if (!r.title.toLowerCase().includes(q) && !r.platform.toLowerCase().includes(q)) return false
  }
  return true
}

const filtered = computed(() => resources.filter(matches))

const activeFilterCount = computed(
  () =>
    filters.levels.length +
    (filters.media ? 1 : 0) +
    (filters.region ? 1 : 0) +
    (filters.query.trim() ? 1 : 0),
)

export function useResources() {
  const byBoard = (board: Board) => filtered.value.filter((r) => r.board === board)
  const recommended = computed(() => filtered.value.filter((r) => r.recommended))

  function toggleLevel(l: Level) {
    const i = filters.levels.indexOf(l)
    i === -1 ? filters.levels.push(l) : filters.levels.splice(i, 1)
  }
  function setMedia(m: Media | null) {
    filters.media = filters.media === m ? null : m
  }
  function setRegion(r: Region | null) {
    filters.region = filters.region === r ? null : r
  }
  function resetFilters() {
    filters.levels = []
    filters.media = null
    filters.region = null
    filters.query = ''
  }

  /** 学习路径 → 资源列表（按 itemMatches 标题子串解析，保序、去空） */
  function resolvePath(p: LearningPath): Resource[] {
    const out: Resource[] = []
    for (const m of p.itemMatches) {
      const hit = resources.find((r) => r.title.includes(m))
      if (hit && !out.includes(hit)) out.push(hit)
    }
    return out
  }

  function setActive(k: HomeActive) {
    home.active = k
    home.topic = ''
  }

  return {
    filters,
    home,
    setActive,
    allLevels: ALL_LEVELS,
    filtered,
    activeFilterCount,
    byBoard,
    recommended,
    resources,
    toggleLevel,
    setMedia,
    setRegion,
    resetFilters,
    resolvePath,
    paths,
    total: resources.length,
  }
}
