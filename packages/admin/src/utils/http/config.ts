/**
 * HTTP 配置
 */

import type { AxiosRequestConfig } from 'axios'

/** 默认配置 */
export const defaultConfig: AxiosRequestConfig = {
  // 基础URL - 从环境变量读取
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',

  // 请求超时时间
  timeout: 30000,

  // 允许跨域携带凭证
  withCredentials: false,

  // 请求头配置
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
}

/** HTTP 状态码映射 */
export const HTTP_STATUS = {
  /** 成功 */
  SUCCESS: 200,
  /** 已创建 */
  CREATED: 201,
  /** 无内容 */
  NO_CONTENT: 204,
  /** 错误请求 */
  BAD_REQUEST: 400,
  /** 未授权 */
  UNAUTHORIZED: 401,
  /** 禁止访问 */
  FORBIDDEN: 403,
  /** 未找到 */
  NOT_FOUND: 404,
  /** 请求超时 */
  REQUEST_TIMEOUT: 408,
  /** 服务器错误 */
  SERVER_ERROR: 500,
  /** 网关错误 */
  BAD_GATEWAY: 502,
  /** 服务不可用 */
  SERVICE_UNAVAILABLE: 503,
} as const

/** 业务状态码 */
export const BIZ_CODE = {
  /** 成功 */
  SUCCESS: 0,
  /** 失败 */
  FAIL: -1,
  /** Token 过期 */
  TOKEN_EXPIRED: 401,
  /** 无权限 */
  NO_PERMISSION: 403,
} as const

/** 错误消息映射 */
export const ERROR_MESSAGES: Record<number, string> = {
  [HTTP_STATUS.BAD_REQUEST]: '请求参数错误',
  [HTTP_STATUS.UNAUTHORIZED]: '登录已过期，请重新登录',
  [HTTP_STATUS.FORBIDDEN]: '没有权限访问该资源',
  [HTTP_STATUS.NOT_FOUND]: '请求的资源不存在',
  [HTTP_STATUS.REQUEST_TIMEOUT]: '请求超时，请稍后重试',
  [HTTP_STATUS.SERVER_ERROR]: '服务器内部错误',
  [HTTP_STATUS.BAD_GATEWAY]: '网关错误',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: '服务暂时不可用',
}
