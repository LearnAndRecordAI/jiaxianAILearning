import { computed, reactive, ref, watch } from 'vue'
import type { Resource } from '../types'
import { claim, monthCount, sign, streak } from '../utils/learning.mjs'
import {minuteLabel} from '../utils/ranking.mjs'

interface State { days: string[]; claims: string[]; seconds: Record<string, number>; courses: Record<string, number>; dailyCourses:Record<string,Record<string,number>>; submissions: Record<string, string> }
const KEY = 'jiaxian.learning-center.v1'
const initial = (): State => ({days:[], claims:[], seconds:{}, courses:{},dailyCourses:{}, submissions:{}})
function load(): State {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!raw) return initial()
    const strings = (v: unknown) => Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string') : []
    const numbers = (v: unknown) => Object.fromEntries(Object.entries(v && typeof v === 'object' ? v : {}).filter(([,n]) => typeof n === 'number' && Number.isFinite(n) && n >= 0)) as Record<string,number>
    return {days:strings(raw.days).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)), claims:strings(raw.claims), seconds:numbers(raw.seconds), courses:numbers(raw.courses),dailyCourses:Object.fromEntries(Object.entries(raw.dailyCourses||{}).filter(([day])=>/^\d{4}-\d{2}-\d{2}$/.test(day)).map(([day,items])=>[day,numbers(items)])), submissions:Object.fromEntries(Object.entries(raw.submissions || {}).filter(([,v])=>typeof v==='string')) as Record<string,string>}
  } catch { return initial() }
}
const state = reactive(load())
const active = ref<Resource | null>(null)
const clock = ref(Date.now())
watch(state, () => {try {localStorage.setItem(KEY, JSON.stringify(state))} catch {/* Browser may disallow storage. */}}, {deep:true})
function refresh() { clock.value = Date.now() }
const today = computed(() => new Intl.DateTimeFormat('sv-SE', {timeZone:'Asia/Shanghai'}).format(clock.value))
const month = computed(() => today.value.slice(0,7))
export function useLearning() {
  function checkin() {refresh(); sign(state,today.value)}
  function record(resource: Resource, seconds: number, sessionSeconds: number) {
    refresh()
    state.seconds[today.value] = (state.seconds[today.value] || 0) + seconds
    state.courses[resource.id] = (state.courses[resource.id] || 0) + seconds
    state.dailyCourses[today.value] ||= {}
    state.dailyCourses[today.value]![resource.id]=(state.dailyCourses[today.value]![resource.id]||0)+seconds
    if (sessionSeconds >= 3) checkin()
  }
  return {state, active, today, month, refresh, checkin, record,
    open: (r: Resource) => { active.value = r },
    count: computed(()=>monthCount(state.days,month.value)),
    consecutive: computed(()=>streak(state.days,today.value)),
    totalSeconds: computed(()=>Object.values(state.seconds).reduce((a,b)=>a+b,0)),
    redeem: (tier: number) => {refresh(); return claim(state,month.value,tier)},
  }
}
export function timeLabel(seconds: number) {
  return minuteLabel(seconds)
}
