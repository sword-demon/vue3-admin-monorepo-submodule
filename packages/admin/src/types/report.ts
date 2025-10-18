/**
 * 报表管理相关类型定义
 */

export interface Report {
  id: number
  name: string
  type: 'sales' | 'user' | 'content' | 'visit' | 'financial'
  startDate: string
  endDate: string
  format: 'excel' | 'pdf'
  status: 'generating' | 'completed' | 'failed'
  fileSize?: number
  creator: string
  creatorId: number
  description?: string
  includeData: string[]
  downloadUrl?: string
  fileName?: string
  createdAt: string
  updatedAt: string
}

export interface ReportListParams {
  page?: number
  pageSize?: number
  name?: string
  type?: string
  status?: string
  dateRange?: [string, string]
}

export interface ReportCreateParams {
  name: string
  type: string
  dateRange: [Date, Date]
  format: string
  includeData: string[]
  description?: string
}

export interface ReportStatistics {
  totalCount: number
  generatingCount: number
  completedCount: number
  failedCount: number
  todayGeneratedCount: number
  totalDownloads: number
  popularTypes: Array<{
    type: string
    count: number
  }>
}

export interface DownloadInfo {
  downloadUrl: string
  fileName: string
  fileSize: number
}