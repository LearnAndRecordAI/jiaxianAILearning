export interface CheckinState { days: string[]; claims: string[] }
export const CHECKIN_REWARDS: {days:number;points:number}[]
export function checkinPoints(claims:string[], month:string):number
export function sign(state: CheckinState, day: string): void
export function monthCount(days: string[], month: string): number
export function streak(days: string[], today: string): number
export function claim(state: CheckinState, month: string, tier: number): boolean
