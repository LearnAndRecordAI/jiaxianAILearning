// Keep legacy IDs so previously claimed rewards retain their original value.
export const TASK_REWARDS = {boards:100, minutes3:50, minutes10:100, hot:50, comment:50, feedback:100, post:150, practice:300,saveShare:100,study1:50,study5:100,study10:150,study60:300}
export function studyMilestones(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0,seconds) : 0
  return [1,5,10,60].map(minutes=>({id:`study${minutes}`,minutes,points:TASK_REWARDS[`study${minutes}`],done:safe>=minutes*60,progress:`${Math.min(minutes,Math.floor(safe/60))}/${minutes} 分钟`}))
}
export function hasSavedShare(bookmarkedIds, sharedIds) {
  const saved = new Set(bookmarkedIds)
  return sharedIds.some(id=>saved.has(id))
}
const datedKey=/^\d{4}-\d{2}-\d{2}:/
const taskId=key=>datedKey.test(key)?key.slice(11):key
export function dailyTaskKey(id,day){return `${day}:${id}`}
export function hasDailyClaim(state,id,day){return state.taskClaims.includes(dailyTaskKey(id,day))||(state.taskClaims.includes(id)&&state.claimDates?.[id]===day)}
export function claimTask(state, id, completedIds, day) {
  const dated=typeof day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(day)
  if (!Object.hasOwn(TASK_REWARDS,id) || !completedIds.includes(id) || (dated?hasDailyClaim(state,id,day):state.taskClaims.includes(id))) return 0
  const key=dated?dailyTaskKey(id,day):id
  state.taskClaims.push(key)
  if(dated) {
    state.claimDates ||= {}
    state.claimDates[key]=day
  }
  return TASK_REWARDS[id]
}
export function periodTaskPoints(state, period) {
  return taskPoints(state.taskClaims.filter(id=>{
    const day=datedKey.test(id)?id.slice(0,10):state.claimDates?.[id]
    return typeof day==='string'&&(day===period||day.startsWith(period+'-'))
  }))
}
export function taskPoints(ids) {
  return [...new Set(ids)].reduce((sum,key)=>sum+(Object.hasOwn(TASK_REWARDS,taskId(key))?TASK_REWARDS[taskId(key)]:0),0)
}
export function normalizeGrowth(raw) {
  const r = raw && typeof raw==='object' ? raw : {}
  const claimed = r.pet?.claimed===true
  return {
    taskClaims:[...new Set((Array.isArray(r.taskClaims)?r.taskClaims:[]).filter(id=>typeof id==='string'&&Object.hasOwn(TASK_REWARDS,taskId(id))))],
    sharedIds:[...new Set((Array.isArray(r.sharedIds)?r.sharedIds:[]).filter(id=>typeof id==='string'))],
    claimDates:Object.fromEntries(Object.entries(r.claimDates&&typeof r.claimDates==='object'?r.claimDates:{}).filter(([id,day])=>Object.hasOwn(TASK_REWARDS,taskId(id))&&typeof day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(day))),
    sharedByDay:Object.fromEntries(Object.entries(r.sharedByDay&&typeof r.sharedByDay==='object'?r.sharedByDay:{}).filter(([day,ids])=>/^\d{4}-\d{2}-\d{2}$/.test(day)&&Array.isArray(ids)).map(([day,ids])=>[day,[...new Set(ids.filter(id=>typeof id==='string'))]])),
    pet:{claimed,enabled:claimed && r.pet?.enabled===true,name:typeof r.pet?.name==='string'?r.pet.name.slice(0,12):'稼小智'},
    print:{color:['red','blue','purple'].includes(r.print?.color)?r.print.color:'red',text:typeof r.print?.text==='string'?r.print.text.slice(0,16):'学AI，上稼先',saved:r.print?.saved===true},
  }
}
