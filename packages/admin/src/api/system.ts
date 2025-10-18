/**
 * 系统管理模块 API
 */

import request from '@/utils/request'
import type {
  User,
  Role,
  Menu,
  PageResult,
  UserListParams,
  UserCreateParams,
  UserUpdateParams,
  UserPasswordParams,
  RoleListParams,
  RoleCreateParams,
  RoleUpdateParams,
  MenuListParams,
  MenuCreateParams,
  MenuUpdateParams,
  SystemSettings,
  SystemSettingsUpdateParams,
} from '@/types/system'

/**
 * ========== 用户管理 ==========
 */

/**
 * 获取用户列表
 */
export const getUserList = (params: UserListParams) => {
  return request.get<PageResult<User>>('/system/user/list', { params })
}

/**
 * 获取用户详情
 */
export const getUser = (id: number) => {
  return request.get<User>(`/system/user/${id}`)
}

/**
 * 创建用户
 */
export const createUser = (data: UserCreateParams) => {
  return request.post<User>('/system/user', data)
}

/**
 * 更新用户
 */
export const updateUser = (data: UserUpdateParams) => {
  const { id, ...updateData } = data
  return request.put<User>(`/system/user/${id}`, updateData)
}

/**
 * 删除用户
 */
export const deleteUser = (id: number) => {
  return request.delete<null>(`/system/user/${id}`)
}

/**
 * 批量删除用户
 */
export const batchDeleteUsers = (ids: number[]) => {
  return request.delete<null>('/system/user/batch', { data: { ids } })
}

/**
 * 修改用户密码
 */
export const updateUserPassword = (data: UserPasswordParams) => {
  const { id, ...passwordData } = data
  return request.put<null>(`/system/user/${id}/password`, passwordData)
}

/**
 * ========== 角色管理 ==========
 */

/**
 * 获取角色列表(分页)
 */
export const getRoleList = (params: RoleListParams) => {
  return request.get<PageResult<Role>>('/system/role/list', { params })
}

/**
 * 获取所有角色(不分页,用于下拉选择)
 */
export const getAllRoles = () => {
  return request.get<Role[]>('/system/role/all')
}

/**
 * 获取角色详情
 */
export const getRole = (id: number) => {
  return request.get<Role>(`/system/role/${id}`)
}

/**
 * 创建角色
 */
export const createRole = (data: RoleCreateParams) => {
  return request.post<Role>('/system/role', data)
}

/**
 * 更新角色
 */
export const updateRole = (data: RoleUpdateParams) => {
  const { id, ...updateData } = data
  return request.put<Role>(`/system/role/${id}`, updateData)
}

/**
 * 删除角色
 */
export const deleteRole = (id: number) => {
  return request.delete<null>(`/system/role/${id}`)
}

/**
 * 批量删除角色
 */
export const batchDeleteRoles = (ids: number[]) => {
  return request.delete<null>('/system/role/batch', { data: { ids } })
}

/**
 * ========== 菜单管理 ==========
 */

/**
 * 获取菜单列表(树形结构)
 */
export const getMenuList = (params?: MenuListParams) => {
  return request.get<Menu[]>('/system/menu/list', { params })
}

/**
 * 获取菜单详情
 */
export const getMenu = (id: number) => {
  return request.get<Menu>(`/system/menu/${id}`)
}

/**
 * 创建菜单
 */
export const createMenu = (data: MenuCreateParams) => {
  return request.post<Menu>('/system/menu', data)
}

/**
 * 更新菜单
 */
export const updateMenu = (data: MenuUpdateParams) => {
  const { id, ...updateData } = data
  return request.put<Menu>(`/system/menu/${id}`, updateData)
}

/**
 * 删除菜单
 */
export const deleteMenu = (id: number) => {
  return request.delete<null>(`/system/menu/${id}`)
}

/**
 * ========== 系统设置 ==========
 */

/**
 * 获取系统设置
 */
export const getSystemSettings = () => {
  return request.get<SystemSettings>('/system/settings')
}

/**
 * 更新系统设置
 */
export const updateSystemSettings = (data: SystemSettingsUpdateParams) => {
  return request.put<SystemSettings>('/system/settings', data)
}
