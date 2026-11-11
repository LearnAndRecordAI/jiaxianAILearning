export function rankLearners<T extends {id:string;seconds:number}>(learners:T[]):(T & {rank:number})[]
export function minuteLabel(seconds:number):string
export function personalStanding(learners:{id:string;seconds:number;points:number}[],id:string):{timeRank:number|null;gap:number|null;eligible:boolean;pointRank:number|null}
export function monthlyAwards<T extends {id:string;seconds:number;points:number}>(learners:T[]):(T & {rank:number;rewardRank:number})[]
