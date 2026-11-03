import type { BoardMeta } from '../types'

export const boards: BoardMeta[] = [
  { id: 'basics', index: '①', icon: 'lightbulb', name: 'AI 基础知识', short: '基础', verb: '懂 AI', desc: '通识 · 概念 · 原理 · AI 素养' },
  { id: 'tools', index: '②', icon: 'wand', name: 'AI 应用', short: '应用', verb: '用 AI', desc: '办公 · 创作 · 工具实践' },
  { id: 'dev', index: '③', icon: 'code', name: '开发与架构', short: '开发', verb: '建 AI', desc: '应用开发 · Agent · MLOps · 系统架构' },
  { id: 'strategy', index: '④', icon: 'radar', name: '前沿洞察与实践', short: '前沿', verb: '探 AI', desc: '前沿技术 · 开源项目 · 实践复现' },
]

export const boardMap: Record<string, BoardMeta> = Object.fromEntries(
  boards.map((b) => [b.id, b]),
)
