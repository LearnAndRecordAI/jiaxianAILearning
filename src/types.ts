// 领域类型定义

/** 4 大板块：基础 / 应用 / 开发 / 前沿 */
export type Board = 'basics' | 'tools' | 'dev' | 'strategy'

/** L1–L5 难度等级 */
export type Level = 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

/** 地区来源 */
export type Region = 'cn' | 'overseas' | 'both'

/** 内容媒介 */
export type Media = 'video' | 'article' | 'both'

/** 一个学习资源 */
export interface Resource {
  id: string
  board: Board
  level: Level
  title: string
  platform: string
  region: Region
  media: Media
  description: string
  collection?: boolean
  episodes?: number
  views?: number
  publishedAt?: string
  note?: string
  repositoryUrl?: string
  recommendationReason?: string
  videos?: { title: string; url: string }[]
  /** 真实外链；缺省表示原文为"站内搜索/需登录" */
  url?: string
  /** 进"推荐课程"行 */
  recommended?: boolean
}

/** 板块元信息 */
export interface BoardMeta {
  id: Board
  index: string // ①②③④⑤（仍保留，用于文档/兜底）
  icon: string // AppIcon 名称
  name: string
  short: string // 短名：基础/应用/开发/前沿
  verb: string // 懂/用/建/管/看 AI
  desc: string
}

/** 首页排序 tab */
export type HomeSort = 'fav' | 'recommend' | 'hot' | 'new'
/** 首页工具行单选项：排序 tab 或 板块，互斥 */
export type HomeActive = HomeSort | Board

/** 学习路径定义（items 用标题子串匹配到资源，鲁棒于 id 变化） */
export interface LearningPath {
  id: string
  title: string
  audience: string
  level: Level
  goal: string
  itemMatches: string[]
}

/** 主内容视图 */
export type ViewName = 'home' | 'board' | 'paths' | 'pathDetail'

/** 筛选状态 */
export interface Filters {
  levels: Level[]
  media: Media | null
  region: Region | null
  query: string
}
