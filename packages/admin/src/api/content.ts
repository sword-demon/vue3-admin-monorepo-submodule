/**
 * 内容管理模块 API
 */

import request from '@/utils/request'
import type {
  Article,
  ArticleListParams,
  ArticleCreateParams,
  ArticleUpdateParams,
  Category,
  CategoryListParams,
  CategoryCreateParams,
  CategoryUpdateParams,
  Tag,
  TagListParams,
  TagCreateParams,
  TagUpdateParams,
  ArticleStatistics,
} from '@/types/content'
import type { PageResult } from '@/types/system'

/**
 * ========== 文章管理 ==========
 */

/**
 * 获取文章列表
 */
export const getArticleList = (params: ArticleListParams) => {
  return request.get<PageResult<Article>>('/content/article/list', { params })
}

/**
 * 获取文章详情
 */
export const getArticle = (id: number) => {
  return request.get<Article>(`/content/article/${id}`)
}

/**
 * 创建文章
 */
export const createArticle = (data: ArticleCreateParams) => {
  return request.post<Article>('/content/article', data)
}

/**
 * 更新文章
 */
export const updateArticle = (data: ArticleUpdateParams) => {
  const { id, ...updateData } = data
  return request.put<Article>(`/content/article/${id}`, updateData)
}

/**
 * 删除文章
 */
export const deleteArticle = (id: number) => {
  return request.delete<null>(`/content/article/${id}`)
}

/**
 * 批量删除文章
 */
export const batchDeleteArticles = (ids: number[]) => {
  return request.delete<null>('/content/article/batch', { data: { ids } })
}

/**
 * 获取文章统计
 */
export const getArticleStatistics = () => {
  return request.get<ArticleStatistics>('/content/article/statistics')
}

/**
 * ========== 分类管理 ==========
 */

/**
 * 获取分类列表(分页)
 */
export const getCategoryList = (params: CategoryListParams) => {
  return request.get<PageResult<Category>>('/content/category/list', { params })
}

/**
 * 获取所有分类(不分页,用于下拉选择)
 */
export const getAllCategories = () => {
  return request.get<Category[]>('/content/category/all')
}

/**
 * 获取分类详情
 */
export const getCategory = (id: number) => {
  return request.get<Category>(`/content/category/${id}`)
}

/**
 * 创建分类
 */
export const createCategory = (data: CategoryCreateParams) => {
  return request.post<Category>('/content/category', data)
}

/**
 * 更新分类
 */
export const updateCategory = (data: CategoryUpdateParams) => {
  const { id, ...updateData } = data
  return request.put<Category>(`/content/category/${id}`, updateData)
}

/**
 * 删除分类
 */
export const deleteCategory = (id: number) => {
  return request.delete<null>(`/content/category/${id}`)
}

/**
 * ========== 标签管理 ==========
 */

/**
 * 获取标签列表(分页)
 */
export const getTagList = (params: TagListParams) => {
  return request.get<PageResult<Tag>>('/content/tag/list', { params })
}

/**
 * 获取所有标签(不分页,用于下拉选择)
 */
export const getAllTags = () => {
  return request.get<Tag[]>('/content/tag/all')
}

/**
 * 获取标签详情
 */
export const getTag = (id: number) => {
  return request.get<Tag>(`/content/tag/${id}`)
}

/**
 * 创建标签
 */
export const createTag = (data: TagCreateParams) => {
  return request.post<Tag>('/content/tag', data)
}

/**
 * 更新标签
 */
export const updateTag = (data: TagUpdateParams) => {
  const { id, ...updateData } = data
  return request.put<Tag>(`/content/tag/${id}`, updateData)
}

/**
 * 删除标签
 */
export const deleteTag = (id: number) => {
  return request.delete<null>(`/content/tag/${id}`)
}

/**
 * 批量删除标签
 */
export const batchDeleteTags = (ids: number[]) => {
  return request.delete<null>('/content/tag/batch', { data: { ids } })
}
