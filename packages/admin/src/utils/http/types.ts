/**
 * HTTP 请求相关类型定义
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/** HTTP 方法类型 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/** 请求配置扩展 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示加载提示 */
  showLoading?: boolean
  /** 是否显示错误提示 */
  showError?: boolean
  /** 是否需要认证 */
  requireAuth?: boolean
  /** 自定义错误处理 */
  errorHandler?: (error: unknown) => void
}

/** 响应数据格式 */
export interface ResponseData<T = unknown> {
  /** 状态码 */
  code: number
  /** 响应数据 */
  data: T
  /** 响应消息 */
  message: string
  /** 时间戳 */
  timestamp?: number
}

/** HTTP 错误类型 */
export interface HttpError {
  /** 错误码 */
  code: number | string
  /** 错误消息 */
  message: string
  /** 原始错误 */
  error?: unknown
  /** 请求配置 */
  config?: AxiosRequestConfig
  /** 响应数据 */
  response?: AxiosResponse
}
