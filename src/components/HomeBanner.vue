<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { resources } from '../data/resources'
import { boards } from '../data/boards'
import { coverFor } from '../utils/covers'
import type { Resource } from '../types'
import { useLearning } from '../composables/useLearning'
import DifficultyTag from './DifficultyTag.vue'
const learning = useLearning()

// 分页轮播：5 页 = 5 个板块，每页取该板块「前 3 门课」的大卡。
// 每 5 秒整页翻到下一个板块（一次换 3 张），循环。
const pages = computed(() =>
  boards.map((b) => resources.filter((r) => r.board === b.id).slice(0, 3)),
)
const total = computed(() => pages.value.length)

const index = ref(0)
let timer = 0

function open(r: Resource) {
  learning.open(r)
}
function go(i: number) {
  const n = total.value || 1
  index.value = ((i % n) + n) % n
}
function start() {
  stop()
  timer = window.setInterval(() => go(index.value + 1), 5000)
}
function stop() {
  if (timer) window.clearInterval(timer)
  timer = 0
}
function onDot(i: number) {
  go(i)
  start()
}

onMounted(start)
onBeforeUnmount(stop)
</script>

<template>
  <section class="wrap">
    <div class="viewport" @mouseenter="stop" @mouseleave="start">
      <div class="track" :style="{ transform: `translateX(${-index * 100}%)` }">
        <div class="page" v-for="(pg, pi) in pages" :key="pi">
          <a v-for="r in pg" :key="r.id" class="bcard" @click="open(r)">
            <img v-if="coverFor(r)" :src="coverFor(r)" class="bg" alt="" loading="lazy" />
            <div class="veil"></div>
            <span v-if="r.media !== 'article'" class="play" aria-hidden="true"></span>
            <div class="cap">
              <div class="k">{{ r.platform }}</div>
              <div class="banner-title"><div class="ti">{{ r.title }}</div><DifficultyTag :difficulty="r.difficulty" :reason="r.difficultyReason" /></div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="dots">
      <button
        v-for="i in total"
        :key="i"
        class="dot"
        :class="{ on: index === i - 1 }"
        :aria-label="`第 ${i} 屏`"
        @click="onDot(i - 1)"
      ></button>
    </div>
  </section>
</template>

<style scoped>
.banner-title{display:flex;gap:8px;align-items:flex-start}
.banner-title .ti{flex:1;min-width:0}
.banner-title>.difficulty-tag{margin-top:3px}
.viewport {
  margin-top: 18px;
  overflow: hidden;
}
.track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
.page {
  flex: 0 0 100%;
  display: flex;
  gap: 16px;
}
.bcard {
  flex: 1 1 0;
  min-width: 0;
  aspect-ratio: 16 / 9;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.15s ease;
}
.bcard:hover {
  transform: translateY(-2px);
}
.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 14, 30, 0.05) 42%, rgba(10, 14, 30, 0.82) 100%);
}
.cap {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 12px;
  z-index: 2;
  color: #fff;
}
.k {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  opacity: 0.85;
}
.ti {
  font-size: 16px;
  font-weight: 800;
  margin-top: 3px;
  line-height: 1.25;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.play {
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  border: 2px solid rgba(255, 255, 255, 0.6);
  display: grid;
  place-items: center;
}
.play::after {
  content: '';
  border-style: solid;
  border-width: 7px 0 7px 12px;
  border-color: transparent transparent transparent #fff;
  margin-left: 3px;
}
.dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 12px 0 4px;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--border-strong);
  border: 0;
  padding: 0;
  cursor: pointer;
  transition: width 0.2s ease, background 0.2s ease;
}
.dot.on {
  width: 20px;
  border-radius: 4px;
  background: var(--accent);
}
@media (prefers-reduced-motion: reduce) {
  .track {
    transition: none;
  }
}
</style>
