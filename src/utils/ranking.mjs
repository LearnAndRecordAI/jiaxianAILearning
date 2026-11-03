export function rankLearners(learners) {
  const sorted=learners.filter(r=>Number.isFinite(r.seconds)&&r.seconds>0).sort((a,b)=>b.seconds-a.seconds||a.id.localeCompare(b.id))
  let rank=0
  return sorted.map((r,i)=>{if(!i||r.seconds!==sorted[i-1].seconds)rank=i+1;return {...r,rank}})
}
