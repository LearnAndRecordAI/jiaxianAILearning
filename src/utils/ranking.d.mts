export function rankLearners<T extends {id:string;seconds:number}>(learners:T[]):(T & {rank:number})[]
