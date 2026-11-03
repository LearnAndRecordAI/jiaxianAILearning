<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const emit = defineEmits<{
  (e: 'home'): void
}>()
const { isDark, toggle } = useTheme()

const freqs = ['关注', '推荐', '热点', '稼问', '直播', '视频', 'AI 学习', '终端', '计算', '半导体', '华为云', '更多']
</script>

<template>
  <header class="bar">
    <div class="inner">
      <button class="logo" @click="emit('home')">稼先<b>社区</b></button>
      <nav class="freqs scroll-x">
        <button
          v-for="f in freqs"
          :key="f"
          class="n"
          :class="{ on: f === 'AI 学习' }"
          @click="f === 'AI 学习' && emit('home')"
        >
          {{ f }}
        </button>
      </nav>
      <div class="right">
        <details class="profile">
          <summary aria-label="稼先社区个人中心" title="稼先社区个人中心"><span class="avatar">稼</span></summary>
          <div class="profile-menu"><strong>稼先社区个人中心</strong><p>全站个人中心入口，demo暂未接入。</p></div>
        </details>
        <button class="ico theme" @click="toggle" :aria-label="isDark() ? '切换到浅色' : '切换到深色'">
          {{ isDark() ? '☀' : '☾' }}
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.profile{position:relative}.profile summary{list-style:none;cursor:pointer}.profile summary::-webkit-details-marker{display:none}.avatar{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--accent);color:white;font-size:14px;font-weight:700}.profile-menu{position:absolute;right:0;top:44px;width:225px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;box-shadow:var(--shadow-card);font-size:13px}.profile-menu p{color:var(--muted);line-height:1.7;margin-bottom:0}
.bar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  backdrop-filter: saturate(1.4) blur(8px);
  border-bottom: 1px solid var(--border);
}
.inner {
  max-width: var(--maxw);
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 24px;
}
.logo {
  font-size: 17px;
  font-weight: 800;
  color: var(--ink);
  background: none;
  border: 0;
  white-space: nowrap;
}
.logo b {
  color: var(--accent-ink);
}
.freqs {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
  min-width: 0;
}
.n {
  font-size: 14px;
  color: var(--ink-2);
  background: none;
  border: 0;
  white-space: nowrap;
  padding: 4px 0;
  position: relative;
}
.n:hover {
  color: var(--ink);
}
.n.on {
  color: var(--accent-ink);
  font-weight: 700;
}
.n.on::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -11px;
  height: 3px;
  background: var(--accent);
  border-radius: 3px;
}
.right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}
.ico {
  font-size: 13px;
  color: var(--ink-2);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 6px 12px;
  white-space: nowrap;
}
.ico:hover {
  border-color: var(--accent-line);
}
.ico.learn {
  position: relative;
}
.dot {
  display: inline-block;
  margin-left: 5px;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
  padding: 0 6px;
}
.theme {
  width: 34px;
  padding: 6px 0;
  text-align: center;
}
@media (max-width: 720px) {
  .freqs {
    display: none;
  }
}
</style>
