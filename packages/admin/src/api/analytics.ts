/**
 * 数据分析相关接口
 */

import request from '@/utils/request'

export interface UserStatistics {
  totalUsers: number
  todayUsers: number
  thisMonthUsers: number
  activeUsers: number
  inactiveUsers: number
  totalArticles: number
  totalComments: number
}

export interface TrendData {
  date: string
  views: number
  users: number
  articles: number
  comments: number
}

export interface HotContent {
  title: string
  views: number
  likes: number
  comments: number
}

export interface Activity {
  id: number
  type: 'publish' | 'comment' | 'edit' | 'like' | 'share'
  content: string
  user: string
  time: string
  timestamp: number
}

export interface DepartmentStatistics {
  department: string
  userCount: number
  activeUsers: number
  totalArticles: number
  totalComments: number
}

export interface OverviewStatistics {
  users: {
    total: number
    today: number
    thisMonth: number
    active: number
  }
  content: {
    totalArticles: number
    todayArticles: number
    totalViews: number
    todayViews: number
    totalComments: number
    todayComments: number
  }
  activities: {
    total: number
    today: number
    publish: number
    comment: number
    edit: number
  }
  system: {
    uptime: string
    responseTime: string
    errorRate: string
    storageUsage: string
  }
}

/**
 * 获取用户统计
 */
export function getUserStatistics(): Promise<UserStatistics> {
  return request.get('/analytics/user/statistics')
}

/**
 * 获取用户列表
 */
export function getUserList(params: {
  page?: number
  pageSize?: number
  department?: string
  status?: string
  keyword?: string
}) {
  return request.get('/analytics/user/list', { params })
}

/**
 * 获取访问趋势数据
 */
export function getTrendData(days: number = 7): Promise<TrendData[]> {
  return request.get('/analytics/trend', { params: { days } })
}

/**
 * 获取热门内容统计
 */
export function getHotContent(type: string = 'article', limit: number = 10): Promise<HotContent[]> {
  return request.get('/analytics/content/hot', { params: { type, limit } })
}

/**
 * 获取最新动态
 */
export function getActivities(limit: number = 20, type?: string): Promise<Activity[]> {
  return request.get('/analytics/activities', { params: { limit, type } })
}

/**
 * 获取部门统计
 */
export function getDepartmentStatistics(): Promise<DepartmentStatistics[]> {
  return request.get('/analytics/department/statistics')
}

/**
 * 获取系统概览统计
 */
export function getOverviewStatistics(): Promise<OverviewStatistics> {
  return request.get('/analytics/overview')
}