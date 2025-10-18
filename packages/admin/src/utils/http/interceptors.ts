/**
 * HTTP 拦截器
 */

import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import type { RequestConfig, ResponseData } from './types'
import { HTTP_STATUS, BIZ_CODE, ERROR_MESSAGES } from './config'
import { getToken, removeToken } from '@/utils/auth'

let loadingInstance: ReturnType<typeof ElLoading.service> | null = null
let loadingCount = 0

/** 显示加载提示 */
const showLoading = () => {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
  loadingCount++
}

/** 隐藏加载提示 */
const hideLoading = () => {
  loadingCount--
  if (loadingCount <= 0) {
    loadingInstance?.close()
    loadingInstance = null
    loadingCount = 0
  }
}

/** 请求拦截器 */
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const customConfig = config as RequestConfig

  // 显示加载提示
  if (customConfig.showLoading !== false) {
    showLoading()
  }

  // 添加 Token
  if (customConfig.requireAuth !== false) {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  // 添加时间戳防止缓存
  if (config.method?.toUpperCase() === 'GET') {
    config.params = {
      ...config.params,
      _t: Date.now(),
    }
  }

  return config
}

/** 请求错误拦截器 */
export const requestErrorInterceptor = (error: AxiosError) => {
  hideLoading()
  ElMessage.error('请求发送失败')
  return Promise.reject(error)
}

/** 响应拦截器 */
export const responseInterceptor = (
  response: AxiosResponse<ResponseData | Blob | ArrayBuffer | unknown>
) => {
  const customConfig = response.config as RequestConfig

  // 隐藏加载提示
  if (customConfig.showLoading !== false) {
    hideLoading()
  }

  const { data } = response

  // 直接返回原始数据（非标准响应格式）
  if (typeof data !== 'object' || !('code' in data)) {
    return data
  }

  const responseData = data as ResponseData

  // 业务成功
  if (responseData.code === BIZ_CODE.SUCCESS) {
    return responseData.data
  }

  // Token 过期
  if (responseData.code === BIZ_CODE.TOKEN_EXPIRED) {
    removeToken()
    ElMessage.error(responseData.message || '登录已过期，请重新登录')
    // 跳转到登录页
    window.location.href = '/login'
    return Promise.reject(new Error(responseData.message))
  }

  // 业务失败
  if (customConfig.showError !== false) {
    ElMessage.error(responseData.message || '请求失败')
  }

  return Promise.reject(new Error(responseData.message))
}

/** 响应错误拦截器 */
export const responseErrorInterceptor = (error: AxiosError) => {
  const customConfig = error.config as RequestConfig | undefined

  // 隐藏加载提示
  if (customConfig?.showLoading !== false) {
    hideLoading()
  }

  // 自定义错误处理
  if (customConfig?.errorHandler) {
    customConfig.errorHandler(error)
    return Promise.reject(error)
  }

  // 网络错误
  if (!error.response) {
    if (customConfig?.showError !== false) {
      ElMessage.error('网络连接失败，请检查网络设置')
    }
    return Promise.reject(error)
  }

  const { status } = error.response

  // 根据状态码显示错误信息
  const message = ERROR_MESSAGES[status] || `请求失败 (${status})`

  if (customConfig?.showError !== false) {
    ElMessage.error(message)
  }

  // Token 过期，跳转登录
  if (status === HTTP_STATUS.UNAUTHORIZED) {
    removeToken()
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
  }

  return Promise.reject(error)
}

/** 安装拦截器 */
export const setupInterceptors = (instance: AxiosInstance) => {
  // 请求拦截器
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor)

  // 响应拦截器
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
}
