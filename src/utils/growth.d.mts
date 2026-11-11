export interface GrowthState {
  taskClaims:string[];
  sharedIds:string[];
  claimDates:Record<string,string>;
  sharedByDay:Record<string,string[]>;
  pet:{claimed:boolean;enabled:boolean;name:string};
  print:{color:string;text:string;saved:boolean};
}
export const TASK_REWARDS:Record<string,number>
export function studyMilestones(seconds:number):{id:string;minutes:number;points:number;done:boolean;progress:string}[]
export function hasSavedShare(bookmarkedIds:Iterable<string>,sharedIds:string[]):boolean
export function dailyTaskKey(id:string,day:string):string
export function hasDailyClaim(state:GrowthState,id:string,day:string):boolean
export function claimTask(state:GrowthState,id:string,completedIds:string[],day?:string):number
export function periodTaskPoints(state:GrowthState,period:string):number
export function taskPoints(ids:string[]):number
export function normalizeGrowth(raw:unknown):GrowthState
