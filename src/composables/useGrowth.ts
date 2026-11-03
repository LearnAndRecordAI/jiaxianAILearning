import {reactive,watch,computed} from 'vue'
import {normalizeGrowth,taskPoints,claimTask} from '../utils/growth.mjs'
const KEY='jiaxian.growth.v1'
function load(){try{return normalizeGrowth(JSON.parse(localStorage.getItem(KEY)||'null'))}catch{return normalizeGrowth(null)}}
const growth=reactive(load())
watch(growth,()=>{try{localStorage.setItem(KEY,JSON.stringify(growth))}catch{}},{deep:true})
export function useGrowth(){return {growth,points:computed(()=>taskPoints(growth.taskClaims)),claim:(id:string,done:string[])=>claimTask(growth,id,done)}}
