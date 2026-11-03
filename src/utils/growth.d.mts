export interface GrowthState {
  taskClaims:string[];
  pet:{claimed:boolean;enabled:boolean;name:string};
  print:{color:string;text:string;saved:boolean};
}
export const TASK_REWARDS:Record<string,number>
export function claimTask(state:GrowthState,id:string,completedIds:string[]):number
export function taskPoints(ids:string[]):number
export function normalizeGrowth(raw:unknown):GrowthState
