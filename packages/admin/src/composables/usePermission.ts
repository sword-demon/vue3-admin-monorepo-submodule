/**
 * 权限相关的组合式函数
 * 提供在 setup 中使用的权限检查功能
 */

import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

/**
 * 权限检查 Hook
 */
export const usePermission = () => {
  const userStore = useUserStore()

  /**
   * 检查是否有指定权限
   * @param permission 权限码
   */
  const hasPermission = (permission: string): boolean => {
    return userStore.hasPermission(permission)
  }

  /**
   * 检查是否有任意一个权限
   * @param permissions 权限码数组
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return userStore.hasAnyPermission(permissions)
  }

  /**
   * 检查是否有所有权限
   * @param permissions 权限码数组
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => userStore.hasPermission(permission))
  }

  /**
   * 检查是否有指定角色
   * @param role 角色
   */
  const hasRole = (role: string): boolean => {
    return userStore.hasRole(role)
  }

  /**
   * 检查是否有任意一个角色
   * @param roles 角色数组
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return userStore.hasAnyRole(roles)
  }

  /**
   * 检查是否有所有角色
   * @param roles 角色数组
   */
  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every((role) => userStore.hasRole(role))
  }

  /**
   * 计算属性: 当前用户的所有权限
   */
  const permissions = computed(() => userStore.userInfo?.permissions || [])

  /**
   * 计算属性: 当前用户的所有角色
   */
  const roles = computed(() => userStore.userInfo?.roles || [])

  /**
   * 计算属性: 是否是超级管理员
   */
  const isSuperAdmin = computed(() => {
    const userRoles = userStore.userInfo?.roles || []
    return userRoles.includes('admin') || userRoles.includes('super_admin')
  })

  return {
    // 权限检查
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // 角色检查
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // 状态
    permissions,
    roles,
    isSuperAdmin,
  }
}
