/**
 * 权限工具函数
 * 用于在非组件环境中进行权限检查（如路由守卫）
 */

import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

/**
 * 检查用户是否有指定权限
 * @param permission 权限码
 */
export const checkPermission = (permission: string): boolean => {
  const userStore = useUserStore()
  return userStore.hasPermission(permission)
}

/**
 * 检查用户是否有任意一个权限
 * @param permissions 权限码数组
 */
export const checkAnyPermission = (permissions: string[]): boolean => {
  const userStore = useUserStore()
  return userStore.hasAnyPermission(permissions)
}

/**
 * 检查用户是否有所有权限
 * @param permissions 权限码数组
 */
export const checkAllPermissions = (permissions: string[]): boolean => {
  const userStore = useUserStore()
  return permissions.every((permission) => userStore.hasPermission(permission))
}

/**
 * 检查用户是否有指定角色
 * @param role 角色
 */
export const checkRole = (role: string): boolean => {
  const userStore = useUserStore()
  return userStore.hasRole(role)
}

/**
 * 检查用户是否有任意一个角色
 * @param roles 角色数组
 */
export const checkAnyRole = (roles: string[]): boolean => {
  const userStore = useUserStore()
  return userStore.hasAnyRole(roles)
}

/**
 * 检查用户是否有所有角色
 * @param roles 角色数组
 */
export const checkAllRoles = (roles: string[]): boolean => {
  const userStore = useUserStore()
  return roles.every((role) => userStore.hasRole(role))
}

/**
 * 检查用户是否是超级管理员
 */
export const isSuperAdmin = (): boolean => {
  const userStore = useUserStore()
  const roles = userStore.userInfo?.roles || []
  return roles.includes('admin') || roles.includes('super_admin')
}

/**
 * 检查路由是否需要权限
 * @param route 路由对象
 */
export const routeRequiresAuth = (route: RouteRecordRaw): boolean => {
  return !!(route.meta?.roles || route.meta?.permissions)
}

/**
 * 检查用户是否有访问路由的权限
 * @param route 路由对象
 */
export const canAccessRoute = (route: RouteRecordRaw): boolean => {
  // 超级管理员拥有所有权限
  if (isSuperAdmin()) {
    return true
  }

  // 检查角色要求
  if (route.meta?.roles && Array.isArray(route.meta.roles)) {
    const roles = route.meta.roles as string[]
    if (!checkAnyRole(roles)) {
      return false
    }
  }

  // 检查权限要求
  if (route.meta?.permissions && Array.isArray(route.meta.permissions)) {
    const permissions = route.meta.permissions as string[]
    if (!checkAnyPermission(permissions)) {
      return false
    }
  }

  return true
}

/**
 * 获取当前用户的所有权限
 */
export const getCurrentPermissions = (): string[] => {
  const userStore = useUserStore()
  return userStore.userInfo?.permissions || []
}

/**
 * 获取当前用户的所有角色
 */
export const getCurrentRoles = (): string[] => {
  const userStore = useUserStore()
  return userStore.userInfo?.roles || []
}
