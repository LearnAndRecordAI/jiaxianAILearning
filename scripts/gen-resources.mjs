// 从归档的「资源库·按板块重分类」HTML 解析出 143 项资源，生成 src/data/resources.ts。
// 运行：npm run gen:data
// 数据源：../docs/ai-learning-channel/05-资源库-按板块重分类.html
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(__dirname, '../../docs/ai-learning-channel/05-资源库-按板块重分类.html')
const OUT = resolve(__dirname, '../src/data/resources.ts')

const BOARD = {
  '①': 'basics',
  '②': 'tools',
  '③': 'dev',
  '④': 'arch',
  '⑤': 'strategy',
}

// 标题子串命中即标记为「推荐课程」
const RECOMMENDED = [
  'Generative AI for Everyone',
  'Elements of AI',
  'Prompt Engineering Interactive Tutorial',
  '微软 GenAI 入门',
  'Datawhale LLM Universe',
  'Hugging Face Agents Course',
  '吴恩达 MLOps',
  'The AI System Design Primer',
  '2026 中国 AI 应用全景图谱',
]

function decode(s) {
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()
}

const html = readFileSync(SRC, 'utf-8')
const parts = html.split(/<!-- (①|②|③|④|⑤) /)
const rowRe =
  /<div class="r"><span class="lv l(\d)">L\d<\/span><div class="body">([\s\S]*?)<\/div><\/div>/g
const nameA = /<a class="nm" href="([^"]*)">([\s\S]*?)<\/a>/
const nameS = /<span class="nm">([\s\S]*?)<\/span>/
const pfRe = /<span class="pf">([\s\S]*?)<\/span>/

const resources = []
const counters = {}

for (let i = 1; i < parts.length; i += 2) {
  const board = BOARD[parts[i]]
  const body = parts[i + 1]
  let m
  rowRe.lastIndex = 0
  while ((m = rowRe.exec(body))) {
    const level = 'L' + m[1]
    const inner = m[2]
    let url = ''
    let title = ''
    const a = inner.match(nameA)
    if (a) {
      url = a[1]
      title = decode(a[2])
    } else {
      const s = inner.match(nameS)
      title = s ? decode(s[1]) : ''
    }
    const pfM = inner.match(pfRe)
    const pf = pfM ? decode(pfM[1]) : ''
    const cn = pf.includes('🇨🇳')
    const ov = pf.includes('🌐')
    const region = cn && ov ? 'both' : cn ? 'cn' : ov ? 'overseas' : 'both'
    const vid = pf.includes('▶')
    const art = pf.includes('📄')
    const media = vid && art ? 'both' : vid ? 'video' : art ? 'article' : 'article'
    const platform = pf.replace(/[🇨🇳🌐▶📄]/g, '').trim()
    counters[board] = (counters[board] || 0) + 1
    const id = `${board}-${String(counters[board]).padStart(2, '0')}`
    const recommended = RECOMMENDED.some((r) => title.includes(r))
    const rec = { id, board, level, title, platform, region, media }
    if (url) rec.url = url
    if (recommended) rec.recommended = true
    resources.push(rec)
  }
}

const header = `// 本文件由 scripts/gen-resources.mjs 自动生成，请勿手改。
// 数据源：docs/ai-learning-channel/05-资源库-按板块重分类.html（143 项，5 份 L1–L5 分级文档重分类）
// 重新生成：npm run gen:data
import type { Resource } from '../types'

export const resources: Resource[] = `

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, header + JSON.stringify(resources, null, 2) + '\n', 'utf-8')

const byBoard = resources.reduce((a, r) => ((a[r.board] = (a[r.board] || 0) + 1), a), {})
console.log(`生成 ${resources.length} 项 → ${OUT}`)
console.log('各板块:', byBoard)
console.log('推荐:', resources.filter((r) => r.recommended).length)
