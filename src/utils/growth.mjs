export const TASK_REWARDS = {boards:100, minutes3:50, minutes10:100, hot:50, comment:50, feedback:100, post:150, practice:300}
export function claimTask(state, id, completedIds) {
  if (!Object.hasOwn(TASK_REWARDS,id) || !completedIds.includes(id) || state.taskClaims.includes(id)) return 0
  state.taskClaims.push(id)
  return TASK_REWARDS[id]
}
export function taskPoints(ids) {
  return [...new Set(ids)].reduce((sum,id)=>sum+(Object.hasOwn(TASK_REWARDS,id)?TASK_REWARDS[id]:0),0)
}
export function normalizeGrowth(raw) {
  const r = raw && typeof raw==='object' ? raw : {}
  const claimed = r.pet?.claimed===true
  return {
    taskClaims:[...new Set((Array.isArray(r.taskClaims)?r.taskClaims:[]).filter(id=>Object.hasOwn(TASK_REWARDS,id)))],
    pet:{claimed,enabled:claimed && r.pet?.enabled===true,name:typeof r.pet?.name==='string'?r.pet.name.slice(0,12):'稼小智'},
    print:{color:['red','blue','purple'].includes(r.print?.color)?r.print.color:'red',text:typeof r.print?.text==='string'?r.print.text.slice(0,16):'学AI，上稼先',saved:r.print?.saved===true},
  }
}
