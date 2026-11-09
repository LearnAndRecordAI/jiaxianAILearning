import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function readResources() {
  const text = readFileSync(new URL('../src/data/resources.ts', import.meta.url), 'utf8')
  return JSON.parse(text.slice(text.indexOf('= [') + 2, text.lastIndexOf(']') + 1))
}

test('keeps the authorized 55 workbook resources and 14 November collections', () => {
  const resources = readResources()
  assert.equal(resources.length, 69)
  assert.ok(!resources.some(r => r.id === 'strategy-09'))
  assert.deepEqual(
    [...new Set(resources.map((item) => item.board))].sort(),
    ['basics', 'dev', 'strategy', 'tools'],
  )
  assert.deepEqual(
    Object.fromEntries(
      ['basics', 'tools', 'dev', 'strategy'].map((board) => [
        board,
        resources.filter((item) => item.board === board).length,
      ]),
    ),
    { basics: 25, tools: 16, dev: 19, strategy: 9 },
  )
})

test('keeps all three cooling videos and does not fabricate an aggregate view count', () => {
  const resources = readResources()
  assert.equal(new Set(resources.map(r => r.id)).size, resources.length)
  const cooling = resources.find(r => r.title === 'AI工厂能效与液冷：电、热、水如何协同')
  assert.equal(cooling.videos.length, 3)
  assert.equal(cooling.views, undefined)
  assert.ok(cooling.videos.every(v => v.title && /^https:\/\/www.bilibili.com\/video\/BV/.test(v.url)))
  assert.equal(resources.find(r => r.title === '3个动画让你认识AI大模型底层技术原理').id, 'basics-03')
})

test('keeps one canonical link per resource and gives every YouTube collection a playback link', () => {
  const resources = readResources()
  const urls = resources.map((item) => item.url).filter(Boolean)
  assert.equal(new Set(urls).size, urls.length)

  const youtube = resources.filter((item) => item.platform === 'YouTube')
  assert.equal(youtube.length, 8)
  assert.ok(youtube.every((item) => /^https:\/\/(www\.)?youtube\.com\//.test(item.url)))
})

test('November import stops at Grok, keeps 39 source links, and is discoverable in both topics', () => {
  const resources = readResources()
  const added = resources.filter(r => r.publishedAt === '2026-11-09')
  assert.equal(added.length, 14)
  assert.ok(added.at(-1).title.startsWith('Grok Bot'))
  assert.equal(added.flatMap(r => r.videos).length, 39)
  assert.equal(new Set(added.flatMap(r => r.videos.map(v => v.url))).size, 39)
  assert.ok(added.every(r => r.episodes === r.videos.length))
  assert.ok(added.every(r => !r.recommendationReason && r.videos.every(v => v.title && v.url)))
  assert.ok(added.every(r => !/Qwen3|Claude Code|OpenClaw/.test(r.title)))
  const topics = JSON.parse(readFileSync(new URL('../src/data/topics.json', import.meta.url), 'utf8'))
  assert.ok(added.slice(0, 7).filter(r => r.id !== 'nov09-strategy-10').every(r => topics[0].resourceIds.includes(r.id)))
  assert.ok(resources.some(r => r.id === 'nov09-strategy-10'), 'cross-layer overview remains available in the main catalogue')
  assert.ok(added.slice(7).every(r => topics[1].resourceIds.includes(r.id)))
})

test('preserves collection metadata used by cards', () => {
  const resources = readResources()
  assert.ok(resources.every((item) => item.title && item.description))
  assert.ok(resources.every((item) => item.media === 'video'))
  assert.ok(resources.filter((item) => item.episodes).every((item) => item.episodes > 0))
})
