/**
 * HTTP 请求封装
 */

import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { defaultConfig } from './config'
import { setupInterceptors } from './interceptors'
import type { RequestConfig } from './types'

/** HTTP 请求类 */
class HttpClient {
  private instance: AxiosInstance

  constructor() {
    // 创建 axios 实例
    this.instance = axios.create(defaultConfig)

    // 安装拦截器
    setupInterceptors(this.instance)
  }

  /**
   * GET 请求
   */
  get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  /**
   * POST 请求
   */
  post<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  /**
   * PUT 请求
   */
  put<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  /**
   * DELETE 请求
   */
  delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  /**
   * PATCH 请求
   */
  patch<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }

  /**
   * 通用请求
   */
  request<T = unknown>(config: RequestConfig): Promise<T> {
    return this.instance.request(config)
  }

  /**
   * 上传文件
   */
  upload<T = unknown>(url: string, file: File | FormData, config?: RequestConfig): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData()
    if (!(file instanceof FormData)) {
      formData.append('file', file)
    }

    return this.instance.post(url, formData, {
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
  download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
    return this.instance
      .get(url, {
        ...config,
        responseType: 'blob',
      })
      .then((response: AxiosResponse) => {
        const blob = new Blob([response.data])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename || this.getFilenameFromResponse(response) || 'download'
        link.click()
        URL.revokeObjectURL(link.href)
      })
  }

  /**
   * 从响应头获取文件名
   */
  private getFilenameFromResponse(response: AxiosResponse): string {
    const disposition = response.headers['content-disposition']
    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (match?.[1]) {
        return match[1].replace(/['"]/g, '')
      }
    }
    return ''
  }
}

// 导出实例
export const http = new HttpClient()

// 导出类型
export type { RequestConfig, ResponseData, HttpError } from './types'
export { HTTP_STATUS, BIZ_CODE } from './config'
