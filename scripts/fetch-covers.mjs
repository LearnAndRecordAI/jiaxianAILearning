// 为每门课抓取真实封面图，下载到 src/assets/covers/ 内嵌。
// 优先级：GitHub 社交卡 → 平台 og:image → 主题真实照片(loremflickr) 兜底。
// 运行：npm run fetch:covers   （内部 demo 用途；图片版权归各来源，仅内部演示）
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '../src/assets/covers')
mkdirSync(OUT_DIR, { recursive: true })

// —— 读取生成的资源数据（resources.ts 内是 JSON 数组）——
const rtxt = readFileSync(resolve(__dirname, '../src/data/resources.ts'), 'utf-8')
const arr = JSON.parse(rtxt.slice(rtxt.indexOf('= [') + 2, rtxt.lastIndexOf(']') + 1))

// 清掉同 id 的旧课程图，避免抓取失败时误用上一版资源的封面。
for (const r of arr) {
  for (const name of readdirSync(OUT_DIR)) {
    if (name.startsWith(`${r.id}.`)) unlinkSync(resolve(OUT_DIR, name))
  }
}

// —— 主题识别（与 utils/topic.ts 保持一致）——
const RULES = [
  [/rag|知识库|检索|retrieval/i, 'rag'],
  [/agent|智能体|多智能体|mcp|crew|langgraph|autogpt|metagpt/i, 'agent'],
  [/prompt|提示词|提示工程/i, 'chat'],
  [/周报|会议|纪要|ppt|办公|竞品|汇报/i, 'doc'],
  [/多模态|视觉|图像|omni|vision|multimodal|图文|绘/i, 'image'],
  [/微调|sft|rlhf|对齐|预训练|fine-?tun|pretrain|量化|蒸馏|推理加速|scaling/i, 'finetune'],
  [/部署|mlops|生产|production|deploy|docker|kubernetes|k8s|网关|平台工程|serving|容器|运维|ci\/cd/i, 'server'],
  [/架构|系统设计|system design|平台|primer/i, 'blueprint'],
  [/产业|趋势|报告|图谱|白皮书|竞争|战略|roadmap|reading list|技术报告|洞察|简报/i, 'chart'],
  [/transformer|attention|神经网络|机器学习|深度学习|deep learning|machine learning|nlp|karpathy|李宏毅|cs224|cs336|cs25|cs285/i, 'network'],
  [/通识|入门|基础|概念|词典|素养|for everyone|fundamentals|101|elements|导论|essentials/i, 'lightbulb'],
]
const BOARD_FALLBACK = { basics: 'lightbulb', tools: 'wand', dev: 'code', arch: 'blueprint', strategy: 'chart' }
function iconFor(title, board) {
  for (const [re, name] of RULES) if (re.test(title)) return name
  return BOARD_FALLBACK[board]
}

// 主题 → loremflickr 关键词（真实照片兜底）
const TOPIC_KW = {
  lightbulb: 'artificial-intelligence,education',
  wand: 'artificial-intelligence,technology',
  code: 'programming,code',
  chat: 'chatbot,technology',
  doc: 'office,laptop',
  rag: 'database,documents',
  agent: 'robot,technology',
  network: 'network,data',
  finetune: 'machine-learning,gpu',
  server: 'datacenter,server',
  blueprint: 'architecture,blueprint',
  image: 'camera,technology',
  chart: 'chart,analytics',
}

const UA = { 'user-agent': 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/124 Safari/537.36', accept: '*/*' }
const extOf = (ct) =>
  ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : ct.includes('gif') ? 'gif' : 'jpg'

async function get(url, ms = 14000) {
  const c = new AbortController()
  const t = setTimeout(() => c.abort(), ms)
  try {
    return await fetch(url, { signal: c.signal, redirect: 'follow', headers: UA })
  } finally {
    clearTimeout(t)
  }
}

const bufCache = new Map() // 源图URL -> {buf, ext}
async function download(url) {
  if (bufCache.has(url)) return bufCache.get(url)
  const r = await get(url)
  const ct = r.headers.get('content-type') || ''
  if (!r.ok || !ct.startsWith('image')) throw new Error(`not image ${r.status} ${ct}`)
  const buf = Buffer.from(await r.arrayBuffer())
  if (buf.length < 1500) throw new Error('too small')
  const res = { buf, ext: extOf(ct) }
  bufCache.set(url, res)
  return res
}

async function ogImage(pageUrl) {
  const r = await get(pageUrl)
  if (!r.ok) throw new Error('page ' + r.status)
  const html = await r.text()
  const m =
    html.match(/property=["']og:image(?::url)?["'][^>]*content=["']([^"']+)/i) ||
    html.match(/name=["']twitter:image["'][^>]*content=["']([^"']+)/i)
  if (!m) throw new Error('no og:image')
  return new URL(m[1], pageUrl).href
}

function githubOG(url) {
  const m = url && url.match(/github\.com\/([^/]+)\/([^/#?]+)/i)
  if (!m) return null
  return `https://opengraph.githubassets.com/1/${m[1]}/${m[2].replace(/\.git$/, '')}`
}

// —— 逐条求封面来源 ——
const YOUTUBE_FIRST_VIDEO = {
  'n8n 官方 Beginner Course（9 集）': '4BVTkqbn_tY',
  'ComfyUI Tutorial Series': 'Zko_s2LO9Wo',
  'CrewAI Tutorial 合集': '-kSOTtYzgEw',
  'Agentic AI using LangGraph 合集': 'yC36gN-rqjo',
}

async function bilibiliImage(url) {
  const match = url?.match(/(BV[0-9A-Za-z]+)/)
  if (!match) return null
  const response = await get(`https://api.bilibili.com/x/web-interface/view?bvid=${match[1]}`)
  if (!response.ok) throw new Error(`bilibili api ${response.status}`)
  const data = await response.json()
  return data?.data?.pic || null
}

async function courseImages(r) {
  if (/bilibili\.com\/video\//i.test(r.url || '')) {
    const image = await bilibiliImage(r.url)
    return image ? [image] : []
  }
  if (r.platform === 'YouTube') {
    const fromUrl = r.url?.match(/[?&]v=([A-Za-z0-9_-]{11})/)?.[1]
    const id = fromUrl || YOUTUBE_FIRST_VIDEO[r.title]
    return id
      ? [
          `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        ]
      : []
  }
  const gh = githubOG(r.url)
  if (gh) return [gh]
  if (!r.url) return []
  try {
    return [await ogImage(r.url)]
  } catch {
    return []
  }
}

let okCourse = 0,
  okTopic = 0,
  fail = 0
const topicDone = new Set()

async function handle(r) {
  // 1) 课程自身封面
  try {
    const sources = await courseImages(r)
    for (const src of sources) {
      try {
        const { buf, ext } = await download(src)
        writeFileSync(resolve(OUT_DIR, `${r.id}.${ext}`), buf)
        okCourse++
        return
      } catch {
        // 同一播放页尝试下一档原站缩略图。
      }
    }
  } catch {
    /* 落到兜底 */
  }
  // 2) 主题真实照片兜底（每主题下载一次）
  const icon = iconFor(r.title, r.board)
  const topicFile = `topic-${icon}`
  if (!topicDone.has(icon)) {
    topicDone.add(icon)
    try {
      const kw = TOPIC_KW[icon] || 'artificial-intelligence'
      const seed = 100 + Object.keys(TOPIC_KW).indexOf(icon)
      const { buf, ext } = await download(`https://loremflickr.com/600/360/${kw}?lock=${seed}`)
      writeFileSync(resolve(OUT_DIR, `${topicFile}.${ext}`), buf)
      okTopic++
    } catch {
      fail++
    }
  }
}

// 并发池
async function pool(items, n, fn) {
  let i = 0
  const workers = Array.from({ length: n }, async () => {
    while (i < items.length) {
      const idx = i++
      try {
        await fn(items[idx])
      } catch {
        fail++
      }
      if (idx % 15 === 0) process.stdout.write('.')
    }
  })
  await Promise.all(workers)
}

console.log(`抓取 ${arr.length} 门课的真实封面…`)
await pool(arr, 6, handle)

// —— Hero 大图（真实 AI 图）——
try {
  const hero = await get('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80')
  const buf = Buffer.from(await hero.arrayBuffer())
  writeFileSync(resolve(OUT_DIR, 'hero.jpg'), buf)
  console.log(`\nHero: hero.jpg ${(buf.length / 1024).toFixed(0)}KB`)
} catch (e) {
  console.log('\nHero 抓取失败:', e.message)
}

console.log(`课程自身封面: ${okCourse} · 主题兜底图: ${okTopic} 张 · 失败: ${fail}`)
console.log(`覆盖：${okCourse} 门有专属封面，其余按主题真实照片；输出 → ${OUT_DIR}`)
