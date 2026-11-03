import type { Resource } from '../types'

// 真实资源没有播放量/时长字段，这里按 id 生成稳定的展示用数据（仅演示）。
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export interface Stats {
  viewsNum: number
  views: string // 如 12.4万
  duration: string // 如 18:20
  date: string // 如 08-21
}

export function statsFor(r: Resource): Stats {
  const h = hash(r.id)
  const viewsNum = r.views ?? (r.videos?.length ? 0 : 5000 + (h % 235000))
  const w = viewsNum / 10000
  const views = r.videos?.length && r.views === undefined ? '分项见简介' : w >= 1 ? w.toFixed(1) + '万' : viewsNum.toString()
  const mins = 4 + ((h >>> 4) % 56)
  const secs = (h >>> 9) % 60
  const duration = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const month = 1 + ((h >>> 12) % 12)
  const day = 1 + ((h >>> 17) % 28)
  const date = r.publishedAt ? r.publishedAt.slice(5) : `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return { viewsNum, views, duration, date }
}
