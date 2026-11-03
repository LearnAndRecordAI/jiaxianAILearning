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
  assert.ok(topics[0].resourceIds.includes('basics-20'))
  assert.ok(topics[1].resourceIds.includes('tools-09'))
  for (const topic of topics) {
    assert.equal(new Set(topic.resourceIds).size, topic.resourceIds.length)
    assert.ok(topic.resourceIds.every(id => ids.has(id)))
  }
})
