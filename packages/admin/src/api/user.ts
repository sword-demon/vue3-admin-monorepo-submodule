/**
 * 用户相关 API
 */

import { http } from '@/utils/http'
import type { LoginParams, LoginResult, UserInfo } from '@/types/user'

/** API 路径 */
const API = {
  /** 登录 */
  LOGIN: '/auth/login',
  /** 登出 */
  LOGOUT: '/auth/logout',
  /** 获取用户信息 */
  USER_INFO: '/auth/user-info',
  /** 刷新 Token */
  REFRESH_TOKEN: '/auth/refresh-token',
}

/**
 * 用户登录
 */
export const login = (params: LoginParams) => {
  return http.post<LoginResult>(API.LOGIN, params)
}

/**
 * 用户登出
 */
export const logout = () => {
  return http.post(API.LOGOUT)
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return http.get<UserInfo>(API.USER_INFO)
}

/**
 * 刷新 Token
 */
export const refreshToken = (refreshToken: string) => {
  return http.post<LoginResult>(API.REFRESH_TOKEN, { refreshToken })
}
