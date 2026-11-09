import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'

function catalogue() {
  const text = readFileSync(new URL('../src/data/resources.ts', import.meta.url), 'utf8')
  return JSON.parse(text.slice(text.indexOf('= [') + 2))
}

test('every collection has one content-based difficulty and an editorial explanation', () => {
  const resources = catalogue()
  assert.equal(resources.length, 69)
  for (const resource of resources) {
    assert.ok(['入门', '基础', '进阶'].includes(resource.difficulty), `${resource.id}: missing difficulty`)
    assert.ok(resource.difficultyReason?.length > 8, `${resource.id}: missing assessment reason`)
    assert.ok(!/#(入门|基础|进阶)/.test(resource.title), 'display tags must not alter original titles')
  }
})

test('classification follows prerequisites rather than board names or marketing titles', () => {
  const byId = Object.fromEntries(catalogue().map(r => [r.id, r]))
  assert.equal(byId['tools-02'].difficulty, '入门')
  assert.equal(byId['basics-03'].difficulty, '入门')
  assert.equal(byId['basics-01'].difficulty, '基础')
  assert.equal(byId['basics-13'].difficulty, '进阶')
  assert.equal(byId['basics-05'].difficulty, '进阶')
  assert.equal(byId['dev-04'].difficulty, '进阶')
  assert.equal(byId['nov09-basics-25'].difficulty, '基础')
})
