export function rankLearners(learners) {
  const sorted=learners.filter(r=>Number.isFinite(r.seconds)&&r.seconds>0).sort((a,b)=>b.seconds-a.seconds||a.id.localeCompare(b.id))
  let rank=0
  return sorted.map((r,i)=>{if(!i||r.seconds!==sorted[i-1].seconds)rank=i+1;return {...r,rank}})
}
export function minuteLabel(seconds) {
  const safe=Number.isFinite(seconds)?Math.max(0,seconds):0
  return `${Math.floor(safe/6)/10}分钟`
}
export function monthlyAwards(learners) {
  const eligible=rankLearners(learners).slice(0,100)
  return eligible.sort((a,b)=>(b.points||0)-(a.points||0)||b.seconds-a.seconds||a.id.localeCompare(b.id)).map((r,i)=>({...r,rewardRank:i+1}))
}
export function personalStanding(learners,id) {
  const ranked=rankLearners(learners)
  const index=ranked.findIndex(r=>r.id===id)
  const timeRank=index>=0&&index<100?ranked[index].rank:null
  const candidate=monthlyAwards(learners).find(r=>r.id===id)
  return {timeRank,gap:index>=100?index+1-100:index>=0?0:null,eligible:index>=0&&index<100,pointRank:candidate&&candidate.rewardRank<=20?candidate.rewardRank:null}
}
