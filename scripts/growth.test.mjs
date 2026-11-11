import test from 'node:test'
import assert from 'node:assert/strict'
test('daily task can be claimed once per Beijing date and monthly points accumulate across days',async()=>{
 const {claimTask,normalizeGrowth,periodTaskPoints,hasDailyClaim}=await import('../src/utils/growth.mjs')
 const s=normalizeGrowth(null)
 assert.equal(claimTask(s,'study1',['study1'],'2026-11-11'),50)
 assert.equal(claimTask(s,'study1',['study1'],'2026-11-11'),0)
 assert.equal(claimTask(s,'study1',['study1'],'2026-11-12'),50)
 assert.equal(periodTaskPoints(normalizeGrowth(s),'2026-11'),100)
 assert.equal(hasDailyClaim(s,'study1','2026-11-13'),false)
 assert.equal(hasDailyClaim(s,'study1','2026-11-12'),true)
})
test('dated legacy claims prevent a duplicate reward on the migration day, not tomorrow',async()=>{
 const {claimTask,normalizeGrowth}=await import('../src/utils/growth.mjs')
 const s=normalizeGrowth({taskClaims:['hot'],claimDates:{hot:'2026-11-11'}})
 assert.equal(claimTask(s,'hot',['hot'],'2026-11-11'),0)
 assert.equal(claimTask(s,'hot',['hot'],'2026-11-12'),50)
})
test('monthly task points only count dated claims within the selected month',async()=>{
 const {claimTask,normalizeGrowth,periodTaskPoints}=await import('../src/utils/growth.mjs')
 assert.equal(typeof periodTaskPoints,'function')
 const state=normalizeGrowth({taskClaims:['minutes3']})
 claimTask(state,'study1',['study1'],'2026-11-11')
 claimTask(state,'study5',['study5'],'2026-10-31')
 assert.equal(periodTaskPoints(state,'2026-11'),50)
 assert.equal(periodTaskPoints(state,'2026-11-11'),50)
 assert.equal(periodTaskPoints(state,'2026-10'),100)
 assert.equal(periodTaskPoints(normalizeGrowth(state),'2026-11'),50)
})

test('low-threshold study milestones unlock at 1, 5, 10 and 60 minutes', async () => {
  const {studyMilestones} = await import('../src/utils/growth.mjs')
  assert.equal(typeof studyMilestones, 'function')
  assert.deepEqual(studyMilestones(59).map(t=>t.done), [false,false,false,false])
  assert.deepEqual(studyMilestones(300).map(t=>t.done), [true,true,false,false])
  assert.deepEqual(studyMilestones(3600).map(t=>t.points), [50,100,150,300])
  assert.ok(studyMilestones(3600).every(t=>t.done))
})

test('collection task requires saving and successfully sharing the same resource', async () => {
  const {hasSavedShare,normalizeGrowth,claimTask} = await import('../src/utils/growth.mjs')
  assert.equal(typeof hasSavedShare, 'function')
  assert.equal(hasSavedShare(['a'], ['b']),false)
  assert.equal(hasSavedShare(['a'], ['a']),true)
  const state=normalizeGrowth({sharedIds:['a','a',null]})
  assert.deepEqual(state.sharedIds,['a'])
  assert.equal(claimTask(state,'saveShare',['saveShare']),100)
  assert.equal(claimTask(state,'saveShare',['saveShare']),0)
})

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
