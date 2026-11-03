import test from 'node:test'
import assert from 'node:assert/strict'
test('collection rows show at most four until expanded without padding or losing order', async()=>{
 const {previewCollections}=await import('../src/utils/collectionPreview.mjs')
 assert.deepEqual(previewCollections([1,2,3,4,5],false),[1,2,3,4])
 assert.deepEqual(previewCollections([1,2,3,4,5],true),[1,2,3,4,5])
 assert.deepEqual(previewCollections([1,2],false),[1,2])
 assert.deepEqual(previewCollections([],false),[])
})
