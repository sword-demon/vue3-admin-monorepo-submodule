/**
 * 共享类型定义
 */

/** 分页参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 分页响应 */
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** API响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 布局模式 */
export type LayoutMode = 'classic' | 'double'

/** 用户角色 */
export type UserRole = 'super-admin' | 'admin' | 'user'

/** 权限类型 */
export type PermissionType = 'menu' | 'button'
