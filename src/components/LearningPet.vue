<script setup lang="ts">
import {ref} from 'vue'
import {useGrowth} from '../composables/useGrowth'
import {useLearning,timeLabel} from '../composables/useLearning'
import mascot from '../assets/mascot/jiaxiaozhi.jpg'
const {growth}=useGrowth()
const {state,today}=useLearning()
const bubble=ref(false)
</script>
<template><aside v-if="growth.pet.claimed&&growth.pet.enabled" class="learning-pet" aria-label="稼小智学习陪伴"><div v-if="bubble" class="bubble"><b>{{ growth.pet.name||'稼小智' }}</b><p>今天已学习 {{ timeLabel(state.seconds[today]||0) }}。学会一点，就很棒！</p><button @click="growth.pet.enabled=false">暂时收起</button><small>可在我的学习 → 学习宠物重新开启</small></div><button class="pet-button" :aria-expanded="bubble" aria-label="和稼小智互动" @click="bubble=!bubble"><img :src="mascot" alt="稼小智"/></button></aside></template>
<style scoped>.learning-pet{position:fixed;right:20px;bottom:18px;z-index:60;display:flex;flex-direction:column;align-items:flex-end;gap:8px}.pet-button{width:82px;height:82px;padding:0;border:2px solid var(--accent-line);border-radius:24px;overflow:hidden;background:white;box-shadow:0 8px 30px #0002;cursor:pointer;animation:bob 4s ease-in-out infinite}.pet-button img{width:100%;height:100%;object-fit:contain}.bubble{width:230px;padding:16px;background:var(--surface);border:1px solid var(--border-strong);border-radius:14px;box-shadow:var(--shadow-card);color:var(--ink);font-size:13px}.bubble p{line-height:1.7;color:var(--muted)}.bubble button{border:0;background:var(--surface-2);color:var(--accent-ink);padding:7px 10px;border-radius:7px;cursor:pointer}.bubble small{display:block;color:var(--muted);font-size:10px;margin-top:9px}@keyframes bob{50%{transform:translateY(-5px)}}@media(prefers-reduced-motion:reduce){.pet-button{animation:none}}@media(max-width:620px){.pet-button{width:62px;height:62px}.learning-pet{right:12px;bottom:12px}}</style>
