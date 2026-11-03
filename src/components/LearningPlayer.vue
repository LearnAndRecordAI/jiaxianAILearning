<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useLearning, timeLabel } from '../composables/useLearning'
import { useUserState } from '../composables/useUserState'
const {active, record} = useLearning()
const {isCompleted,toggleCompleted} = useUserState()
const playing = ref(false), seconds = ref(0)
let last = performance.now(), timer = 0
watch(()=>active.value?.id,()=>{seconds.value=0; playing.value=false; last=performance.now()})
function visibility() {last=performance.now()}
onMounted(()=>{
  document.addEventListener('visibilitychange',visibility)
  timer = window.setInterval(()=>{
    const now=performance.now(), delta=Math.min((now-last)/1000,1.5); last=now
    if (active.value && playing.value && !document.hidden) {
      seconds.value += delta
      record(active.value,delta,seconds.value)
    }
  },250)
})
onUnmounted(()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visibility)})
</script>
<template>
  <div v-if="active" class="overlay" @click.self="active=null">
    <section class="player" role="dialog" aria-modal="true" aria-label="合集学习演示" @keydown.esc="active=null">
      <header><span>合集学习演示</span><button @click="active=null" aria-label="关闭学习演示">✕</button></header>
      <div class="stage"><span class="demo">模拟播放 · 非原视频</span><div class="orb">▶</div><h2>{{ active.title }}</h2><p>点击开始体验3秒自动签到</p><button class="primary" @click="playing=!playing">{{ playing?'暂停模拟播放':'开始模拟播放' }}</button></div>
      <div class="session"><span>本次演示学习 <b>{{ timeLabel(seconds) }}</b></span><span>{{ seconds>=3?'✓ 今日已自动签到':`再播放${Math.max(0,Math.ceil(3-seconds))}秒自动签到` }}</span></div>
      <p class="hint">仅页面可见且模拟播放时计时。外部原视频观看无法统计，正式版需接入播放器。</p>
      <footer><a v-if="active.url" :href="active.url" target="_blank" rel="noopener noreferrer">打开原始资源 ↗</a><button @click="toggleCompleted(active.id)">{{ isCompleted(active.id)?'✓ 已标记学过':'标记该合集已学过' }}</button></footer>
    </section>
  </div>
</template>
<style scoped>
.overlay{position:fixed;inset:0;z-index:100;background:#10162799;display:grid;place-items:center;padding:20px}.player{width:min(760px,100%);max-height:90vh;overflow:auto;background:var(--surface);border-radius:20px;padding:24px;color:var(--ink)}header,footer,.session{display:flex;align-items:center;justify-content:space-between;gap:16px}header{font-weight:700;margin-bottom:18px}button{cursor:pointer;border:1px solid var(--border);border-radius:9px;padding:9px 14px;background:var(--surface-2);color:var(--ink)}.stage{text-align:center;background:linear-gradient(140deg,#151d3b,#353e72);color:white;border-radius:14px;padding:26px 28px}.demo{font-size:12px;color:#c8d0f5}.orb{font-size:40px;margin:22px}.stage h2{font-size:22px;line-height:1.6}.stage p{font-size:14px;color:#d3d8ed}.primary{background:#7989ec;color:white;border:0}.session{padding:18px 0;font-size:14px}.session b{color:var(--accent-ink)}.hint{font-size:12px;color:var(--muted);line-height:1.7}footer{border-top:1px solid var(--border);padding-top:16px}a{color:var(--accent-ink);font-size:14px}
</style>
