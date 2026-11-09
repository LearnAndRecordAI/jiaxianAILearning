import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

test('hot topics curate distinct AI DC and office collections without missing IDs', () => {
  const path = new URL('../src/data/topics.json', import.meta.url)
  assert.ok(existsSync(path), 'hot topic catalogue exists')
  const topics = JSON.parse(readFileSync(path, 'utf8'))
  const text = readFileSync(new URL('../src/data/resources.ts', import.meta.url), 'utf8')
  const resources = JSON.parse(text.slice(text.indexOf('= [') + 2))
  const ids = new Set(resources.map(r => r.id))
  assert.deepEqual(topics.map(t => t.id), ['ai-dc', 'office'])
  assert.equal(topics[0].label, 'AI算力工厂')
  assert.deepEqual(topics[0].sections.map(s => s.label), ['应用层', '模型层', '基础设施层', '芯片层', '能源层'])
  assert.deepEqual(topics[0].sections[0].resourceIds, ['tools-08', 'dev-11', 'dev-12', 'dev-13', 'dev-06', 'dev-09'])
  assert.ok(!topics[0].resourceIds.includes('tools-09'), 'office productivity is not a factory application course')
  assert.ok(!topics[0].resourceIds.includes('tools-06'))
  assert.ok(topics[0].sections[1].resourceIds.includes('basics-03'))
  assert.ok(topics[0].sections[1].resourceIds.includes('basics-07'))
  assert.ok(topics[0].sections[1].resourceIds.includes('dev-04'))
  assert.ok(!topics[0].sections[1].resourceIds.includes('dev-14'), 'missing playback URL stays out of featured model collections')
  const infrastructure = topics[0].sections.find(s => s.label === '基础设施层')
  const energy = topics[0].sections.find(s => s.label === '能源层')
  assert.ok(['basics-16', 'basics-21'].every(id => energy.resourceIds.includes(id) && !infrastructure.resourceIds.includes(id)))
  const groupedIds = topics[0].sections.flatMap(s => s.resourceIds)
  assert.equal(groupedIds.length, new Set(groupedIds).size, 'one primary factory layer per collection')
  assert.ok(topics[0].resourceIds.every(id => groupedIds.includes(id)), 'every factory collection remains discoverable')
  for (const section of topics[0].sections) {
    assert.equal(new Set(section.resourceIds).size, section.resourceIds.length)
    assert.ok(section.resourceIds.every(id => ids.has(id)))
  }
  assert.ok(topics[0].resourceIds.includes('basics-20'))
  assert.ok(topics[1].resourceIds.includes('tools-09'))
  for (const topic of topics) {
    assert.equal(new Set(topic.resourceIds).size, topic.resourceIds.length)
    assert.ok(topic.resourceIds.every(id => ids.has(id)))
  }
})
