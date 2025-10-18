/**
 * 用户认证 Store
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo, LoginParams } from '@/types/user'
import * as userApi from '@/api/user'
import {
  getToken,
  setToken,
  setRefreshToken,
  setTokenExpire,
  getUserInfo as getStoredUserInfo,
  setUserInfo as setStoredUserInfo,
  clearAuth,
} from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(getToken() || '')
  const userInfo = ref<UserInfo | null>(getStoredUserInfo())
  const loading = ref(false)

  /**
   * 登录
   */
  const login = async (params: LoginParams): Promise<void> => {
    loading.value = true
    try {
      const result = await userApi.login(params)

      // 保存 Token
      token.value = result.token
      setToken(result.token)

      // 保存刷新 Token
      if (result.refreshToken) {
        setRefreshToken(result.refreshToken)
      }

      // 保存过期时间
      if (result.expire) {
        setTokenExpire(result.expire)
      }

      // 保存用户信息
      if (result.userInfo) {
        userInfo.value = result.userInfo
        setStoredUserInfo(result.userInfo)
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取用户信息
   */
  const fetchUserInfo = async (): Promise<UserInfo> => {
    loading.value = true
    try {
      const info = await userApi.getUserInfo()
      userInfo.value = info
      setStoredUserInfo(info)
      return info
    } finally {
      loading.value = false
    }
  }

  /**
   * 登出
   */
  const logout = async (): Promise<void> => {
    loading.value = true
    try {
      await userApi.logout()
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      // 清除本地数据
      resetState()

      // 重置权限状态
      const { usePermissionStore } = await import('./permission')
      const permissionStore = usePermissionStore()
      permissionStore.resetRoutes()

      loading.value = false
    }
  }

  /**
   * 重置状态
   */
  const resetState = (): void => {
    token.value = ''
    userInfo.value = null
    clearAuth()
  }

  /**
   * 更新用户信息
   */
  const updateUserInfo = (info: Partial<UserInfo>): void => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...info }
      setStoredUserInfo(userInfo.value)
    }
  }

  /**
   * 检查是否有权限
   */
  const hasPermission = (permission: string): boolean => {
    if (!userInfo.value?.permissions) {
      return false
    }
    return userInfo.value.permissions.includes(permission)
  }

  /**
   * 检查是否有角色
   */
  const hasRole = (role: string): boolean => {
    if (!userInfo.value?.roles) {
      return false
    }
    return userInfo.value.roles.includes(role)
  }

  /**
   * 检查是否有任一权限
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission))
  }

  /**
   * 检查是否有任一角色
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => hasRole(role))
  }

  return {
    // 状态
    token,
    userInfo,
    loading,

    // 方法
    login,
    logout,
    fetchUserInfo,
    resetState,
    updateUserInfo,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAnyRole,
  }
})
