import test from 'node:test'
import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
test('ranks positive learning times, gives ties the same rank and excludes zero-time users',async()=>{
 const path=new URL('../src/utils/ranking.mjs',import.meta.url)
 assert.ok(existsSync(path),'ranking helper exists')
 const {rankLearners}=await import(path.href)
 const result=rankLearners([{id:'a',seconds:60},{id:'b',seconds:120},{id:'me',seconds:60},{id:'zero',seconds:0}])
 assert.deepEqual(result.map(r=>[r.id,r.rank]),[['b',1],['a',2],['me',2]])
})
