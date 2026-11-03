import type { LearningPath } from '../types'

// itemMatches：标题子串，运行时解析为资源（见 useResources.resolvePath）。
// 从当前评审合集里按标题匹配学习路径。
export const paths: LearningPath[] = [
  {
    id: 'p-30min',
    title: '30 分钟了解 AI',
    audience: '全员',
    level: 'L1',
    goal: '建立对 AI 的基本认知',
    itemMatches: ['吴恩达《AI for Everyone》', 'Elements of AI', 'AI 101：Complete', '人工智能通识（微课版）'],
  },
  {
    id: 'p-office',
    title: '3 小时学会用 AI 办公',
    audience: '非技术员工',
    level: 'L2',
    goal: '把 AI 用到日常工作',
    itemMatches: [
      'AI 提示词入门',
      'Prompt Engineering Best Practices',
      'AI Prompting for Everyone',
      'Prompt Engineering Absolute Beginners',
    ],
  },
  {
    id: 'p-prompt',
    title: '7 天掌握 Prompt',
    audience: '全员 / 产品 / 运营',
    level: 'L2',
    goal: '能写高质量提示词',
    itemMatches: [
      'Prompt Engineering Interactive Tutorial',
      'AI Prompting for Everyone',
      'ChatGPT Prompt Eng',
      'OpenAI Cookbook',
    ],
  },
  {
    id: 'p-dev',
    title: '14 天入门 AI 应用开发',
    audience: '开发人员',
    level: 'L3',
    goal: '能做简单 AI 应用',
    itemMatches: [
      '微软 GenAI 入门',
      'Datawhale LLM Universe',
      'Hugging Face Agents Course',
      'LangGraph+MCP 智能体开发',
      'LLM-DEV-COOKBOOK',
    ],
  },
  {
    id: 'p-arch',
    title: '30 天掌握企业 AI 架构',
    audience: '架构师 / 技术负责人',
    level: 'L4',
    goal: '能设计 AI 系统',
    itemMatches: [
      '吴恩达 MLOps',
      'The AI System Design Primer',
      'RAG+LangChain 企业级私有知识库',
      'MLOps Zoomcamp',
      '2026 企业 AI Agent 落地',
    ],
  },
  {
    id: 'p-strategy',
    title: '每周 AI 战略简报',
    audience: '管理者',
    level: 'L5',
    goal: '跟踪趋势与机会',
    itemMatches: [
      '机器之心',
      '2026 中国 AI 应用全景图谱',
      '迈向 L5 级智能',
      'Qwen3.5-Omni 技术报告',
    ],
  },
]
