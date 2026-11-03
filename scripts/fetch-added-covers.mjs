// Only fetch original Bilibili covers for this import; never replace existing assets.
import {readFileSync,writeFileSync} from 'node:fs'
const root = new URL('../', import.meta.url)
const text = readFileSync(new URL('src/data/resources.ts',root),'utf8')
const records = JSON.parse(text.slice(text.indexOf('= [')+2))
const added = records.filter(r => r.recommendationReason)
await Promise.all(added.map(async r => {
  const file = new URL(`src/assets/covers/${r.id}-catalogue-20261102.jpg`,root)
  try {
    const bv = r.url.match(/BV[0-9A-Za-z]+/)[0]
    const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bv}`,{signal:AbortSignal.timeout(12000)})
    const json = await response.json()
    if (!json.data?.pic) throw Error(`No original cover (${json.code})`)
    const image = await fetch(json.data.pic,{signal:AbortSignal.timeout(12000)})
    if (!image.ok || !image.headers.get('content-type')?.startsWith('image/')) throw Error('Invalid image')
    writeFileSync(file,Buffer.from(await image.arrayBuffer()))
    console.log(`${r.id}: original cover saved`)
  } catch(e) { console.log(`${r.id}: ${e.message}`) }
}))
