/**
 * 系统管理模块类型定义
 */

import type { PageParams, PageResult } from './common'

// 重新导出通用类型,保持向后兼容
export type { PageParams, PageResult }

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ENABLED = 1,
  DISABLED = 0,
}

/**
 * 用户性别枚举
 */
export enum UserGender {
  MALE = 1,
  FEMALE = 2,
  UNKNOWN = 0,
}

/**
 * 菜单类型枚举
 */
export enum MenuType {
  DIRECTORY = 1, // 目录
  MENU = 2, // 菜单
  BUTTON = 3, // 按钮
}

/**
 * 菜单状态枚举
 */
export enum MenuStatus {
  ENABLED = 1,
  DISABLED = 0,
}

/**
 * 用户信息
 */
export interface User {
  id: number
  username: string
  realName: string
  email: string
  phone: string
  avatar: string
  gender: UserGender
  status: UserStatus
  roleIds: number[]
  roles: string[]
  department: string
  remark?: string
  lastLoginTime?: string
  createdAt: string
  updatedAt: string
}

/**
 * 角色信息
 */
export interface Role {
  id: number
  code: string
  name: string
  description: string
  permissions: string[]
  status: UserStatus
  sort: number
  createdAt: string
  updatedAt: string
}

/**
 * 菜单信息
 */
export interface Menu {
  id: number
  parentId: number
  name: string
  path: string
  component?: string
  redirect?: string
  icon?: string
  type: MenuType
  status: MenuStatus
  sort: number
  permissions?: string[]
  hidden: boolean
  keepAlive: boolean
  children?: Menu[]
  createdAt: string
  updatedAt: string
}

/**
 * 用户列表查询参数
 */
export interface UserListParams extends PageParams {
  username?: string
  realName?: string
  status?: UserStatus
  roleId?: number
  department?: string
}

/**
 * 用户创建参数
 */
export interface UserCreateParams {
  username: string
  password: string
  realName: string
  email: string
  phone: string
  avatar?: string
  gender: UserGender
  status: UserStatus
  roleIds: number[]
  department: string
  remark?: string
}

/**
 * 用户更新参数
 */
export interface UserUpdateParams {
  id: number
  realName?: string
  email?: string
  phone?: string
  avatar?: string
  gender?: UserGender
  status?: UserStatus
  roleIds?: number[]
  department?: string
  remark?: string
}

/**
 * 用户密码修改参数
 */
export interface UserPasswordParams {
  id: number
  password: string
}

/**
 * 角色列表查询参数
 */
export interface RoleListParams extends PageParams {
  name?: string
  code?: string
  status?: UserStatus
}

/**
 * 角色创建参数
 */
export interface RoleCreateParams {
  code: string
  name: string
  description: string
  permissions: string[]
  status: UserStatus
  sort: number
}

/**
 * 角色更新参数
 */
export interface RoleUpdateParams {
  id: number
  name?: string
  description?: string
  permissions?: string[]
  status?: UserStatus
  sort?: number
}

/**
 * 菜单列表查询参数
 */
export interface MenuListParams {
  name?: string
  status?: MenuStatus
  type?: MenuType
}

/**
 * 菜单创建参数
 */
export interface MenuCreateParams {
  parentId: number
  name: string
  path: string
  component?: string
  redirect?: string
  icon?: string
  type: MenuType
  status: MenuStatus
  sort: number
  permissions?: string[]
  hidden: boolean
  keepAlive: boolean
}

/**
 * 菜单更新参数
 */
export interface MenuUpdateParams {
  id: number
  parentId?: number
  name?: string
  path?: string
  component?: string
  redirect?: string
  icon?: string
  type?: MenuType
  status?: MenuStatus
  sort?: number
  permissions?: string[]
  hidden?: boolean
  keepAlive?: boolean
}

/**
 * 系统设置
 */
export interface SystemSettings {
  siteTitle: string
  siteSubtitle?: string
  siteLogo: string
  siteFavicon: string
  seoKeywords: string[]
  seoDescription: string
  seoAuthor?: string
  copyright?: string
  icpNumber?: string
  analyticsScript?: string
  updatedAt: string
}

/**
 * 系统设置更新参数
 */
export type SystemSettingsUpdateParams = Partial<Omit<SystemSettings, 'updatedAt'>> & {
  updatedAt?: string
}
