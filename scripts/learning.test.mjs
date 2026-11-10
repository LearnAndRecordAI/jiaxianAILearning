import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'

test('monthly sign-ins are unique and rewards are independently claimable once', async () => {
  const path = new URL('../src/utils/learning.mjs', import.meta.url)
  assert.ok(existsSync(path), 'learning rules implemented')
  const {monthCount, sign, claim, streak} = await import(path.href)
  const state = {days: [], claims: []}
  sign(state, '2026-10-31'); sign(state, '2026-11-01'); sign(state, '2026-11-01')
  assert.equal(monthCount(state.days, '2026-11'), 1)
  assert.equal(streak(state.days, '2026-11-01'), 2)
  assert.equal(claim(state, '2026-11', 12), false)
  for (let d=2;d<=21;d++) sign(state, `2026-11-${String(d).padStart(2,'0')}`)
  assert.equal(claim(state, '2026-11', 12), true)
  assert.equal(claim(state, '2026-11', 12), false)
  assert.equal(claim(state, '2026-11', 21), true)
  assert.equal(claim(state, '2026-12', 21), false)
  assert.equal(claim(state, '2026-11', 3), false)
})

test('seven-day reward unlocks on monthly cumulative days, not consecutive days', async () => {
  const {sign, claim} = await import('../src/utils/learning.mjs')
  const state = {days:[],claims:[]}
  for (const day of [1,3,4,6,8,10]) sign(state, `2026-11-${String(day).padStart(2,'0')}`)
  assert.equal(claim(state,'2026-11',7),false)
  sign(state,'2026-11-12')
  assert.equal(claim(state,'2026-11',7),true)
  assert.equal(claim(state,'2026-11',7),false)
  assert.equal(claim(state,'2026-11',12),false)
  assert.equal(claim(state,'2026-12',7),false)
})

test('claimed monthly points add all three tiers once and ignore unknown tiers and other months', async () => {
  const {checkinPoints} = await import('../src/utils/learning.mjs')
  assert.equal(typeof checkinPoints,'function')
  assert.equal(checkinPoints([], '2026-11'),0)
  assert.equal(checkinPoints(['2026-11:7','2026-11:7','2026-10:21','2026-11:99'],'2026-11'),500)
  assert.equal(checkinPoints(['2026-11:7','2026-11:12'],'2026-11'),2000)
  assert.equal(checkinPoints(['2026-11:7','2026-11:12','2026-11:21'],'2026-11'),5000)
})
