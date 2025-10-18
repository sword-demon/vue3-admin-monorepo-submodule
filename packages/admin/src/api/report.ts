/**
 * 报表管理相关接口
 */

import request from '@/utils/request'
import type {
  Report,
  ReportListParams,
  ReportCreateParams,
  ReportStatistics,
  DownloadInfo,
} from '@/types/report'
import type { PageResult } from '@/types/system'

/**
 * 获取报表列表
 */
export function getReportList(params: ReportListParams): Promise<PageResult<Report>> {
  return request.get('/report/list', { params })
}

/**
 * 获取报表详情
 */
export function getReportDetail(id: number): Promise<Report> {
  return request.get(`/report/${id}`)
}

/**
 * 创建报表生成任务
 */
export function createReport(data: ReportCreateParams): Promise<Report> {
  return request.post('/report', data)
}

/**
 * 重新生成报表
 */
export function regenerateReport(id: number): Promise<void> {
  return request.post(`/report/${id}/regenerate`)
}

/**
 * 删除报表
 */
export function deleteReport(id: number): Promise<void> {
  return request.delete(`/report/${id}`)
}

/**
 * 批量删除报表
 */
export function batchDeleteReports(ids: number[]): Promise<void> {
  return request.delete('/report/batch', { data: { ids } })
}

/**
 * 下载报表
 */
export function downloadReport(id: number): Promise<DownloadInfo> {
  return request.get(`/report/${id}/download`)
}

/**
 * 获取报表统计数据
 */
export function getReportStatistics(): Promise<ReportStatistics> {
  return request.get('/report/statistics')
}

// 重新导出类型，保持向后兼容
export type {
  Report,
  ReportListParams,
  ReportCreateParams,
  ReportStatistics,
  DownloadInfo,
}