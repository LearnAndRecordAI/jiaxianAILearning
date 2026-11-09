import type { Resource } from '../types'
import { coverIcon } from './topic'
import { selectCourseCover } from './playbackCover.mjs'

// 内嵌真实封面：src/assets/covers/ 下
//  - <id>.<ext>        每门课自己的封面（GitHub 社交卡 / 平台 og:image）
//  - topic-<icon>.jpg  主题真实照片（无课程封面时按主题匹配）
//  - hero.jpg          Banner 大图
const files = import.meta.glob('../assets/covers/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const map: Record<string, string> = {}
for (const p in files) {
  const base = p.split('/').pop()!.replace(/\.[a-z]+$/i, '')
  map[base] = files[p]
}

/** 课程封面：优先课程专属图，退到主题真实照片 */
export function coverFor(r: Resource): string | undefined {
  return selectCourseCover(r.id, coverIcon(r.title, r.board), map)
}

/** 是否为课程专属封面（用于是否叠加暗角） */
export function isOwnCover(r: Resource): boolean {
  return !!(map[r.id + '-frame-20261109'] ?? map[r.id + '-catalogue-20261102'] ?? map[r.id])
}

export const heroImage: string | undefined = map['hero']
