import type { Board } from '../types'

// 从课程标题识别主题 → 匹配封面图标名（AppIcon）。命中即返回，按具体度从上到下排。
const RULES: Array<[RegExp, string]> = [
  [/rag|知识库|检索|retrieval/i, 'rag'],
  [/agent|智能体|多智能体|mcp|crew|langgraph|autogpt|metagpt/i, 'agent'],
  [/prompt|提示词|提示工程/i, 'chat'],
  [/周报|会议|纪要|ppt|办公|竞品|汇报/i, 'doc'],
  [/多模态|视觉|图像|omni|vision|multimodal|图文|绘/i, 'image'],
  [/微调|sft|rlhf|对齐|预训练|fine-?tun|pretrain|量化|蒸馏|推理加速|scaling/i, 'finetune'],
  [/部署|mlops|生产|production|deploy|docker|kubernetes|k8s|网关|平台工程|serving|容器|运维|ci\/cd/i, 'server'],
  [/架构|系统设计|system design|平台|primer/i, 'blueprint'],
  [/产业|趋势|报告|图谱|白皮书|竞争|战略|roadmap|reading list|技术报告|洞察|简报/i, 'chart'],
  [/transformer|attention|神经网络|机器学习|深度学习|deep learning|machine learning|nlp|karpathy|李宏毅|cs224|cs336|cs25|cs285/i, 'network'],
  [/通识|入门|基础|概念|词典|素养|for everyone|fundamentals|101|elements|导论|essentials/i, 'lightbulb'],
]

const BOARD_FALLBACK: Record<Board, string> = {
  basics: 'lightbulb',
  tools: 'wand',
  dev: 'code',
  strategy: 'chart',
}

export function coverIcon(title: string, board: Board): string {
  for (const [re, name] of RULES) {
    if (re.test(title)) return name
  }
  return BOARD_FALLBACK[board]
}
