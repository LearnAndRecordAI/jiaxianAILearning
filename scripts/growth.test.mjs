import test from 'node:test'
import assert from 'node:assert/strict'

test('task rewards reject unfinished, unknown and repeated claims', async () => {
  const {claimTask, taskPoints} = await import('../src/utils/growth.mjs')
  const state = {taskClaims: []}
  assert.equal(claimTask(state, 'minutes3', []), 0)
  assert.equal(claimTask(state, 'unknown', ['unknown']), 0)
  assert.equal(claimTask(state, 'minutes3', ['minutes3']), 50)
  assert.equal(claimTask(state, 'minutes3', ['minutes3']), 0)
  assert.deepEqual(state.taskClaims, ['minutes3'])
  assert.equal(taskPoints(state.taskClaims), 50)
  assert.equal(taskPoints(['minutes3', 'minutes3', 'unknown']), 50)
})

test('new growth settings validate saved data without granting claims or eligibility', async () => {
  const {normalizeGrowth} = await import('../src/utils/growth.mjs')
  const state = normalizeGrowth({taskClaims:['minutes3','fake','minutes3'],pet:{claimed:true,enabled:true,name:'小智'},print:{color:'fake',text:'我的小智'}})
  assert.deepEqual(state.taskClaims, ['minutes3'])
  assert.equal(state.pet.name, '小智')
  assert.equal(state.print.color, 'red')
  assert.equal(normalizeGrowth(null).pet.claimed, false)
  assert.equal(normalizeGrowth({pet:{enabled:true}}).pet.enabled, false)
})
