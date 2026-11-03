import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function readResources() {
  const text = readFileSync(new URL('../src/data/resources.ts', import.meta.url), 'utf8')
  return JSON.parse(text.slice(text.indexOf('= [') + 2, text.lastIndexOf(']') + 1))
}

test('preserves the 44 reviewed resources and appends 12 resources into four categories', () => {
  const resources = readResources()
  assert.equal(resources.length, 56)
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
    { basics: 21, tools: 9, dev: 17, strategy: 9 },
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
  assert.equal(youtube.length, 4)
  assert.ok(youtube.every((item) => /^https:\/\/(www\.)?youtube\.com\//.test(item.url)))
})

test('preserves collection metadata used by cards', () => {
  const resources = readResources()
  assert.ok(resources.every((item) => item.title && item.description))
  assert.ok(resources.every((item) => item.media === 'video'))
  assert.ok(resources.filter((item) => item.episodes).every((item) => item.episodes > 0))
})
