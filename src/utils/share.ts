import type { Resource } from '../types'
import {useGrowth} from '../composables/useGrowth'

function rememberShare(id:string) {
  const {growth}=useGrowth()
  if(!growth.sharedIds.includes(id)) growth.sharedIds.push(id)
  const day=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date())
  growth.sharedByDay[day] ||= []
  if(!growth.sharedByDay[day].includes(id))growth.sharedByDay[day].push(id)
}

// 分享：优先系统分享，其次复制链接到剪贴板。返回结果用于提示。
export async function shareResource(r: Resource): Promise<'shared' | 'copied' | 'fail'> {
  const url = r.url || (typeof location !== 'undefined' ? location.href : '')
  const nav = typeof navigator !== 'undefined' ? navigator : undefined
  if (nav && typeof nav.share === 'function' && r.url) {
    try {
      await nav.share({ title: r.title, text: r.title, url })
      rememberShare(r.id)
      return 'shared'
    } catch {
      /* 用户取消或失败，回落到复制 */
    }
  }
  if (nav && nav.clipboard && url) {
    try {
      await nav.clipboard.writeText(url)
      rememberShare(r.id)
      return 'copied'
    } catch {
      /* ignore */
    }
  }
  return 'fail'
}
