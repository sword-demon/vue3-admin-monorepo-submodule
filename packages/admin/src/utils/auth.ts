/**
 * 认证相关工具函数
 */

/** Token 存储键名 */
const TOKEN_KEY = 'admin_token'

/** 刷新 Token 存储键名 */
const REFRESH_TOKEN_KEY = 'admin_refresh_token'

/** Token 过期时间存储键名 */
const TOKEN_EXPIRE_KEY = 'admin_token_expire'

/** 用户信息存储键名 */
const USER_INFO_KEY = 'admin_user_info'

/**
 * 获取 Token
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (error) {
    console.error('获取 Token 失败:', error)
    return null
  }
}

/**
 * 设置 Token
 */
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch (error) {
    console.error('设置 Token 失败:', error)
  }
}

/**
 * 移除 Token
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRE_KEY)
  } catch (error) {
    console.error('移除 Token 失败:', error)
  }
}

/**
 * 获取刷新 Token
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error('获取刷新 Token 失败:', error)
    return null
  }
}

/**
 * 设置刷新 Token
 */
export const setRefreshToken = (token: string): void => {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } catch (error) {
    console.error('设置刷新 Token 失败:', error)
  }
}

/**
 * 设置 Token 过期时间
 */
export const setTokenExpire = (expire: number): void => {
  try {
    localStorage.setItem(TOKEN_EXPIRE_KEY, String(expire))
  } catch (error) {
    console.error('设置 Token 过期时间失败:', error)
  }
}

/**
 * 获取 Token 过期时间
 */
export const getTokenExpire = (): number | null => {
  try {
    const expire = localStorage.getItem(TOKEN_EXPIRE_KEY)
    return expire ? Number(expire) : null
  } catch (error) {
    console.error('获取 Token 过期时间失败:', error)
    return null
  }
}

/**
 * 检查 Token 是否过期
 */
export const isTokenExpired = (): boolean => {
  const expire = getTokenExpire()
  if (!expire) {
    return true
  }
  return Date.now() >= expire
}

/**
 * 获取用户信息
 */
export const getUserInfo = <T = unknown>(): T | null => {
  try {
    const info = localStorage.getItem(USER_INFO_KEY)
    return info ? (JSON.parse(info) as T) : null
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 设置用户信息
 */
export const setUserInfo = <T>(userInfo: T): void => {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
  } catch (error) {
    console.error('设置用户信息失败:', error)
  }
}

/**
 * 移除用户信息
 */
export const removeUserInfo = (): void => {
  try {
    localStorage.removeItem(USER_INFO_KEY)
  } catch (error) {
    console.error('移除用户信息失败:', error)
  }
}

/**
 * 清除所有认证信息
 */
export const clearAuth = (): void => {
  removeToken()
  removeUserInfo()
}

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  const token = getToken()
  return !!token && !isTokenExpired()
}
