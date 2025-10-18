/**
 * 权限管理 Store
 * 负责管理动态路由和权限控制
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import { useUserStore } from './user'

/**
 * 检查路由是否有权限访问
 */
const hasPermission = (
  route: { meta?: RouteMeta },
  roles: string[],
  permissions: string[]
): boolean => {
  // 如果路由配置了角色要求
  if (route.meta?.roles && Array.isArray(route.meta.roles)) {
    return (route.meta.roles as string[]).some((role) => roles.includes(role))
  }

  // 如果路由配置了权限要求
  if (route.meta?.permissions && Array.isArray(route.meta.permissions)) {
    return (route.meta.permissions as string[]).some((permission) => permissions.includes(permission))
  }

  // 没有配置权限要求,默认允许访问
  return true
}

/**
 * 递归过滤路由
 */
const filterAsyncRoutes = (
  routes: RouteRecordRaw[],
  roles: string[],
  permissions: string[]
): RouteRecordRaw[] => {
  const result: RouteRecordRaw[] = []

  routes.forEach((route) => {
    const tmp = { ...route }

    // 检查当前路由是否有权限
    if (hasPermission(tmp, roles, permissions)) {
      // 如果有子路由,递归过滤
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, permissions)
      }

      result.push(tmp)
    }
  })

  return result
}

export const usePermissionStore = defineStore('permission', () => {
  // ========== 状态 ==========

  /** 所有路由(静态+动态) */
  const routes = ref<RouteRecordRaw[]>([])

  /** 动态路由(根据权限生成) */
  const dynamicRoutes = ref<RouteRecordRaw[]>([])

  /** 是否已生成路由 */
  const isRoutesGenerated = ref(false)

  // ========== Actions ==========

  /**
   * 生成路由
   * @param asyncRoutes 异步路由配置
   */
  const generateRoutes = async (asyncRoutes: RouteRecordRaw[]): Promise<RouteRecordRaw[]> => {
    const userStore = useUserStore()

    // 获取用户角色和权限
    const roles = userStore.userInfo?.roles || []
    const permissions = userStore.userInfo?.permissions || []

    // 超级管理员拥有所有权限
    let accessedRoutes: RouteRecordRaw[]
    if (roles.includes('admin') || roles.includes('super_admin')) {
      accessedRoutes = asyncRoutes || []
    } else {
      // 根据角色和权限过滤路由
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles, permissions)
    }

    dynamicRoutes.value = accessedRoutes
    isRoutesGenerated.value = true

    return accessedRoutes
  }

  /**
   * 设置所有路由
   */
  const setRoutes = (newRoutes: RouteRecordRaw[]): void => {
    routes.value = newRoutes
  }

  /**
   * 重置路由
   */
  const resetRoutes = (): void => {
    routes.value = []
    dynamicRoutes.value = []
    isRoutesGenerated.value = false
  }

  /**
   * 检查路由是否可访问
   */
const canAccessRoute = (route: { meta?: RouteMeta }): boolean => {
    const userStore = useUserStore()
    const roles = userStore.userInfo?.roles || []
    const permissions = userStore.userInfo?.permissions || []

    return hasPermission(route, roles, permissions)
  }

  return {
    // 状态
    routes,
    dynamicRoutes,
    isRoutesGenerated,

    // Actions
    generateRoutes,
    setRoutes,
    resetRoutes,
    canAccessRoute,
  }
})
