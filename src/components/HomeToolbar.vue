<script setup lang="ts">
import type { HomeSort } from '../types'
import { boards } from '../data/boards'
import { useResources } from '../composables/useResources'
import topics from '../data/topics.json'

const { home, setActive } = useResources()
const emit = defineEmits<{ (e: 'learning'): void }>()

const sorts: { key: HomeSort; label: string }[] = [
  { key: 'fav', label: '收藏' },
  { key: 'recommend', label: '推荐' },
  { key: 'hot', label: '最热' },
  { key: 'new', label: '最新' },
]

function toggleTopic(id: string) {
  const selected = home.topic === id
  setActive('recommend')
  home.query = ''
  home.topic = selected ? '' : id
}
</script>

<template>
  <div class="toolbar">
    <div class="menu-strip">
    <div class="sorts">
      <button
        v-for="s in sorts"
        :key="s.key"
        class="s"
        :class="{ on: home.active === s.key }"
        @click="setActive(s.key)"
      >
        {{ s.label }}
      </button>
    </div>
    <div class="boards">
      <button
        v-for="b in boards"
        :key="b.id"
        class="c"
        :class="{ on: home.active === b.id }"
        @click="setActive(b.id)"
      >
        {{ b.short }}
      </button>
    </div>
    </div>
    <div class="topics" aria-label="热门专题">
      <button v-for="topic in topics" :key="topic.id" class="topic" :class="{ selected: home.topic === topic.id }"
        :title="`${topic.description} · ${topic.resourceIds.length}个合集`"
        :aria-pressed="home.topic === topic.id" @click="toggleTopic(topic.id)">
        <span class="topic-name">{{ topic.label }}</span>
      </button>
    </div>
    <div class="search">
      <span class="mag" aria-hidden="true"></span>
      <input v-model="home.query" type="search" placeholder="搜索合集" aria-label="搜索" />
    </div>
    <button class="my-learning" @click="emit('learning')">我的学习</button>
  </div>
</template>

<style scoped>
.my-learning{flex:none;white-space:nowrap;border:1px solid var(--accent-line);background:var(--surface-2);color:var(--accent-ink);border-radius:20px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer}
.menu-strip { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; overflow-x: auto; scrollbar-width: thin; padding: 3px 0; }
.topics { display:flex;align-items:center;gap:8px;flex:none;border-left:1px solid var(--border);padding-left:12px }
.topic { flex: none; white-space: nowrap; border: 1px solid var(--accent-line); border-radius: 16px; padding: 5px 12px; background: var(--surface-2); color: var(--accent-ink); cursor: pointer; }
.topic:hover, .topic.selected { border-color: var(--accent); background: var(--surface-3); }
.topic.selected .topic-name { color: var(--accent-ink); }
.topic-name { font-weight: 700; font-size: 13px; }
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0 6px;
  flex-wrap: nowrap;
}
.sorts {
  display: flex;
  gap: 6px;
  flex: none;
}
.s {
  font-size: 13.5px;
  color: var(--ink-2);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 5px 10px;
  white-space: nowrap;
}
.s:hover {
  border-color: var(--accent-line);
}
.s.on {
  background: var(--accent);
  border-color: transparent;
  color: #fff;
  font-weight: 700;
}
.boards {
  display: flex;
  gap: 6px;
  flex: none;
  min-width: 0;
  padding-bottom: 2px;
}
.c {
  font-size: 13.5px;
  color: var(--ink-2);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 5px 10px;
  white-space: nowrap;
}
.c:hover {
  border-color: var(--accent-line);
}
.c.on {
  background: var(--accent);
  border-color: transparent;
  color: #fff;
  font-weight: 700;
}
.search {
  flex: 0 1 150px;
  min-width: 92px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 7px 14px;
  width: 150px;
}
.search .mag {
  width: 13px;
  height: 13px;
  border: 2px solid var(--muted);
  border-radius: 50%;
  position: relative;
  flex: none;
}
.search .mag::after {
  content: '';
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 6px;
  height: 2px;
  background: var(--muted);
  transform: rotate(45deg);
}
.search input {
  border: 0;
  background: none;
  outline: none;
  color: var(--ink);
  font-size: 13.5px;
  width: 100%;
  min-width: 0;
}
@media (max-width: 720px) {
  .toolbar{flex-wrap:wrap}
  .menu-strip{flex-basis:100%}
  .topics{border-left:0;padding-left:0}
  .search{flex:1;min-width:80px;width:100px}
  .topic{padding:5px 9px}
  .my-learning{padding:7px 10px}
}
</style>
