import { reactive, computed, watch } from 'vue'
import type { LearningPath, Resource } from '../types'

// 纯前端用户状态：收藏 + 学过，持久化到 localStorage。
// 路径进度由 completed 推导（勾一次"学过"，所有含它的路径同步推进）。

const KEY_BOOKMARKS = 'jiaxian.bookmarks'
const KEY_COMPLETED = 'jiaxian.completed'

function load(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

const state = reactive({
  bookmarks: new Set<string>(load(KEY_BOOKMARKS)),
  completed: new Set<string>(load(KEY_COMPLETED)),
})

watch(
  () => [...state.bookmarks],
  (v) => localStorage.setItem(KEY_BOOKMARKS, JSON.stringify(v)),
  { deep: true },
)
watch(
  () => [...state.completed],
  (v) => localStorage.setItem(KEY_COMPLETED, JSON.stringify(v)),
  { deep: true },
)

export function useUserState() {
  const isBookmarked = (id: string) => state.bookmarks.has(id)
  const isCompleted = (id: string) => state.completed.has(id)

  function toggleBookmark(id: string) {
    state.bookmarks.has(id) ? state.bookmarks.delete(id) : state.bookmarks.add(id)
  }
  function toggleCompleted(id: string) {
    state.completed.has(id) ? state.completed.delete(id) : state.completed.add(id)
  }

  const bookmarkCount = computed(() => state.bookmarks.size)
  const completedCount = computed(() => state.completed.size)

  /** 某路径的完成进度（0–1）与计数 */
  function pathProgress(items: Resource[]) {
    if (items.length === 0) return { done: 0, total: 0, ratio: 0 }
    const done = items.filter((r) => state.completed.has(r.id)).length
    return { done, total: items.length, ratio: done / items.length }
  }

  /** 进行中的路径（有进度但未完成） */
  function inProgressPaths(
    all: LearningPath[],
    resolve: (p: LearningPath) => Resource[],
  ) {
    return all
      .map((p) => ({ path: p, items: resolve(p) }))
      .map((x) => ({ ...x, prog: pathProgress(x.items) }))
      .filter((x) => x.prog.done > 0 && x.prog.done < x.prog.total)
  }

  return {
    bookmarks: state.bookmarks,
    completed: state.completed,
    isBookmarked,
    isCompleted,
    toggleBookmark,
    toggleCompleted,
    bookmarkCount,
    completedCount,
    pathProgress,
    inProgressPaths,
  }
}
