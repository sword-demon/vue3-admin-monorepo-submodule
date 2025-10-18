/**
 * Axios 封装 - HTTP 请求工具
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from './auth'
import router from '@/router'

/**
 * 响应数据结构
 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    // 添加 Token
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

    // 如果响应不是标准的 ApiResponse 格式(如文件下载),直接返回
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      return response
    }

    // 成功响应
    if (res.code === 200 || res.code === 0) {
      return res.data
    }

    // Token 过期或无效
    if (res.code === 401 || res.code === 403) {
      ElMessage.error(res.message || '登录已过期,请重新登录')
      // 清除本地存储并跳转到登录页
      localStorage.clear()
      router.push('/login')
      return Promise.reject(new Error(res.message || '未授权'))
    }

    // 业务错误
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    console.error('响应错误:', error)

    // 网络错误
    if (!error.response) {
      ElMessage.error('网络连接失败,请检查网络设置')
      return Promise.reject(error)
    }

    // HTTP 错误
    const { status, data } = error.response

    switch (status) {
      case 400:
        ElMessage.error(data?.message || '请求参数错误')
        break
      case 401:
        ElMessage.error('登录已过期,请重新登录')
        localStorage.clear()
        router.push('/login')
        break
      case 403:
        ElMessage.error('没有权限访问该资源')
        break
      case 404:
        console.warn(data?.message || '请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器内部错误')
        break
      case 502:
        ElMessage.error('网关错误')
        break
      case 503:
        ElMessage.error('服务不可用')
        break
      default:
        ElMessage.error(data?.message || `请求失败 (${status})`)
    }

    return Promise.reject(error)
  }
)

/**
 * 请求方法封装
 */
class Request {
  /**
   * GET 请求
   */
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  }

  /**
   * POST 请求
   */
  post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  }

  /**
   * PUT 请求
   */
  put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  }

  /**
   * DELETE 请求
   */
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  }

  /**
   * PATCH 请求
   */
  patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  }

  /**
   * 上传文件
   */
  upload<T = unknown>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    })
  }

  /**
   * 下载文件
   */
  download(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    return service.get(url, {
      ...config,
      responseType: 'blob',
    })
  }
}

export default new Request()
