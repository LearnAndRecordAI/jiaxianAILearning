<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Resource } from '../types'
import { useUserState } from '../composables/useUserState'
import { coverFor } from '../utils/covers'
import { statsFor } from '../utils/stats'
import { shareResource } from '../utils/share'
import { boardMap } from '../data/boards'
import { useLearning } from '../composables/useLearning'
import DifficultyTag from './DifficultyTag.vue'

const props = defineProps<{ resource: Resource; compact?: boolean }>()
const { isBookmarked, toggleBookmark } = useUserState()
const learning = useLearning()

const cover = computed(() => coverFor(props.resource))
const stats = computed(() => statsFor(props.resource))
const boardShort = computed(() => boardMap[props.resource.board]?.short ?? '')
const hasVideo = computed(() => props.resource.media !== 'article')
const mediaTag = computed(() => (hasVideo.value ? '▶ 视频' : '📄 图文'))
const displayTitle = computed(() => props.resource.title)
const durationLabel = computed(() =>
  props.resource.collection && props.resource.episodes ? `共${props.resource.episodes}集` : stats.value.duration,
)
const regionFlag = computed(() =>
  props.resource.region === 'cn' ? '🇨🇳' : props.resource.region === 'overseas' ? '🌐' : '🇨🇳🌐',
)
const hasUrl = computed(() => !!props.resource.url)

function open() {
  learning.open(props.resource)
}

const toast = ref('')
let toastTimer = 0
async function onShare() {
  const r = await shareResource(props.resource)
  toast.value = r === 'copied' ? '已复制链接' : r === 'shared' ? '已分享' : '分享失败'
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 1600)
}
</script>

<template>
  <article class="card" :class="{ compact }">
    <div class="cover" :class="{ clickable: hasUrl }" @click="open">
      <img v-if="cover" :src="cover" class="photo" alt="" loading="lazy" />
      <span class="mt">{{ mediaTag }}</span>
      <span class="bd">{{ boardShort }}</span>
      <span v-if="hasVideo" class="play" aria-hidden="true"></span>
      <span class="views"><span class="pi" aria-hidden="true"></span>{{ stats.views }}</span>
      <span class="dur">{{ durationLabel }}</span>
    </div>
    <div class="cbody">
      <div class="title-row">
      <a v-if="hasUrl" class="title" :href="resource.url" @click.prevent="open">
        <span v-if="resource.collection" class="collection-icon" aria-hidden="true">▤</span>{{ displayTitle }}
      </a>
      <span v-else class="title no-link" :title="'内网资源，待配置播放地址'">
        <span v-if="resource.collection" class="collection-icon" aria-hidden="true">▤</span>{{ displayTitle }}
      </span>
      <DifficultyTag :difficulty="resource.difficulty" :reason="resource.difficultyReason" />
      </div>
      <p class="summary">{{ resource.description }}</p>
      <details v-if="resource.videos?.length" class="resource-details">
        <summary>视频目录</summary>
        <ol v-if="resource.videos?.length">
          <li v-for="video in resource.videos" :key="video.url"><a :href="video.url" target="_blank" rel="noopener noreferrer">{{ video.title }}</a></li>
        </ol>
      </details>
      <div class="meta">
        <span class="pf">{{ resource.platform }}</span>
        <span class="flag">{{ regionFlag }}</span>
        <span class="date">{{ stats.date }}</span>
      </div>
      <div class="acts">
        <button class="act" :class="{ on: isBookmarked(resource.id) }" :aria-pressed="isBookmarked(resource.id)" @click="toggleBookmark(resource.id)">
          {{ isBookmarked(resource.id) ? '♥' : '♡' }} 收藏
        </button>
        <button class="act share" @click="onShare">↗ 分享</button>
      </div>
    </div>
    <transition name="toast"><span v-if="toast" class="toast">{{ toast }}</span></transition>
  </article>
</template>

<style scoped>
.compact .summary,.compact .meta,.compact .acts,.compact .resource-details{display:none}
.compact .cbody{padding:10px 12px;gap:0}
.compact .title{font-size:13px;min-height:35px}
.compact .play{left:auto;top:10px;right:10px;transform:none;width:28px;height:28px}
.compact .mt{display:none}
.resource-details { font-size: 12px; line-height: 1.7; margin: 8px 0; }
.resource-details summary { cursor: pointer; color: var(--accent-ink); }
.resource-details p { margin: 6px 0; }
.resource-details ol { padding-left: 20px; margin: 6px 0; }
.resource-details a { color: var(--accent-ink); }
.card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  transition: transform 0.14s ease;
}
.card:hover {
  transform: translateY(-2px);
}
.cover {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--surface-3);
}
.cover.clickable {
  cursor: pointer;
}
.photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.mt {
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 2;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  background: rgba(16, 20, 32, 0.6);
  border-radius: 5px;
  padding: 1px 7px;
}
.bd {
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 2;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: var(--accent);
  border-radius: 5px;
  padding: 1px 7px;
}
.play {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.82);
  display: grid;
  place-items: center;
}
.play::after {
  content: '';
  border-style: solid;
  border-width: 6px 0 6px 10px;
  border-color: transparent transparent transparent var(--accent-ink);
  margin-left: 3px;
}
.views {
  position: absolute;
  left: 8px;
  bottom: 8px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);
}
.views .pi {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 7px;
  border-color: transparent transparent transparent #fff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}
.dur {
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 2;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);
}
.cbody {
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}
.title {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--ink);
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 38px;
}
.title-row{display:flex;align-items:flex-start;gap:6px;min-width:0}
.title-row>.difficulty-tag{margin-top:1px}
.collection-icon {
  display: inline-block;
  margin-right: 5px;
  color: var(--accent-ink);
}
.summary {
  margin: -1px 0 0;
  color: var(--muted);
  font-size: 11.5px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 33px;
}
a.title:hover {
  color: var(--accent-ink);
}
.title.no-link {
  color: var(--ink-2);
  cursor: default;
}
.meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--muted);
  margin-top: auto;
}
.meta .pf {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.meta .date {
  margin-left: auto;
  flex: none;
  font-variant-numeric: tabular-nums;
  color: var(--muted);
}
.acts {
  display: flex;
  gap: 8px;
}
.act {
  flex: 1;
  font-size: 12px;
  padding: 5px 6px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--ink-2);
  transition: all 0.12s ease;
}
.act:hover {
  border-color: var(--accent-line);
}
.act.on {
  background: var(--accent-soft);
  border-color: var(--accent-line);
  color: var(--accent-ink);
  font-weight: 700;
}
.toast {
  position: absolute;
  left: 50%;
  bottom: 54px;
  transform: translateX(-50%);
  z-index: 5;
  background: rgba(16, 20, 32, 0.9);
  color: #fff;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 16px;
  white-space: nowrap;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
