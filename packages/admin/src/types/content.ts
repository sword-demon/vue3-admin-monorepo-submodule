/**
 * 内容管理模块类型定义
 */

import type { PageParams } from './common'

/**
 * 文章状态枚举
 */
export enum ArticleStatus {
  DRAFT = 1, // 草稿
  PUBLISHED = 2, // 已发布
  ARCHIVED = 3, // 已归档
}

/**
 * 分类信息
 */
export interface Category {
  id: number
  name: string
  slug: string
  description: string
  sort: number
  articleCount: number
  createdAt: string
  updatedAt: string
}

/**
 * 标签信息
 */
export interface Tag {
  id: number
  name: string
  slug: string
  color: string
  articleCount: number
  createdAt: string
  updatedAt: string
}

/**
 * 文章信息
 */
export interface Article {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  cover: string
  author: string
  authorId: number
  categoryId: number
  categoryName: string
  tags: Tag[]
  tagIds: number[]
  status: ArticleStatus
  viewCount: number
  likeCount: number
  commentCount: number
  isTop: boolean
  isRecommend: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * 文章列表查询参数
 */
export interface ArticleListParams extends PageParams {
  title?: string
  author?: string
  categoryId?: number
  tagId?: number
  status?: ArticleStatus
  isTop?: boolean
  isRecommend?: boolean
  startDate?: string
  endDate?: string
}

/**
 * 文章创建参数
 */
export interface ArticleCreateParams {
  title: string
  slug: string
  summary: string
  content: string
  cover: string
  categoryId: number
  tagIds: number[]
  status: ArticleStatus
  isTop: boolean
  isRecommend: boolean
}

/**
 * 文章更新参数
 */
export interface ArticleUpdateParams {
  id: number
  title?: string
  slug?: string
  summary?: string
  content?: string
  cover?: string
  categoryId?: number
  tagIds?: number[]
  status?: ArticleStatus
  isTop?: boolean
  isRecommend?: boolean
}

/**
 * 分类列表查询参数
 */
export interface CategoryListParams extends PageParams {
  name?: string
}

/**
 * 分类创建参数
 */
export interface CategoryCreateParams {
  name: string
  slug: string
  description: string
  sort: number
}

/**
 * 分类更新参数
 */
export interface CategoryUpdateParams {
  id: number
  name?: string
  slug?: string
  description?: string
  sort?: number
}

/**
 * 标签列表查询参数
 */
export interface TagListParams extends PageParams {
  name?: string
}

/**
 * 标签创建参数
 */
export interface TagCreateParams {
  name: string
  slug: string
  color: string
}

/**
 * 标签更新参数
 */
export interface TagUpdateParams {
  id: number
  name?: string
  slug?: string
  color?: string
}

/**
 * 文章统计数据
 */
export interface ArticleStatistics {
  totalCount: number
  publishedCount: number
  draftCount: number
  archivedCount: number
  todayPublishedCount: number
  totalViewCount: number
  totalLikeCount: number
  totalCommentCount: number
}
