/**
 * 报表管理模块 Mock 数据
 * 创建时间: 2025-10-18
 * 最后更新: 2025-10-18 - 支持报表生成、预览、下载功能
 */

import { MockMethod } from 'vite-plugin-mock'
import type { PageResult } from '@/types/system'

// 生成报表数据
const generateReports = () => {
  const reports = []
  const types = ['sales', 'user', 'content', 'visit', 'financial']
  const typeNames = {
    sales: '销售报表',
    user: '用户报表',
    content: '内容报表',
    visit: '访问报表',
    financial: '财务报表'
  }
  const statuses = ['generating', 'completed', 'failed']
  const formats = ['excel', 'pdf']

  const creators = ['张三', '李四', '王五', '赵六', '钱七', '孙八']

  for (let i = 1; i <= 25; i++) {
    const type = types[i % types.length]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const format = formats[Math.floor(Math.random() * formats.length)]
    const creator = creators[i % creators.length]

    // 生成日期范围
    const endDate = new Date()
    endDate.setDate(endDate.getDate() - Math.floor(Math.random() * 30))
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30) + 7)

    const createdAt = new Date(endDate)
    createdAt.setDate(createdAt.getDate() + Math.floor(Math.random() * 3))

    reports.push({
      id: i,
      name: `${typeNames[type]} - ${startDate.toISOString().slice(0, 7)}月`,
      type,
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      format,
      status,
      fileSize: status === 'completed' ? Math.floor(Math.random() * 1000000) + 100000 : undefined,
      filePath: status === 'completed' ? `/reports/${type}_${i}.${format}` : undefined,
      creator,
      creatorId: (i % creators.length) + 1,
      description: `${typeNames[type]}统计报告，包含详细的数据分析和图表展示`,
      includeData: ['chart', 'table', 'summary'],
      downloadUrl: status === 'completed' ? `https://example.com/download/report-${i}.${format}` : undefined,
      fileName: status === 'completed' ? `${typeNames[type]}_${startDate.toISOString().slice(0, 7)}月.${format}` : undefined,
      createdAt: createdAt.toISOString().slice(0, 19).replace('T', ' '),
      updatedAt: createdAt.toISOString().slice(0, 19).replace('T', ' '),
    })
  }

  return reports
}

// 初始化数据
let reports = generateReports()
let nextReportId = reports.length + 1

export default [
  /**
   * ========== 报表管理 ==========
   */

  /**
   * 获取报表列表
   */
  {
    url: '/api/report/list',
    method: 'get',
    response: ({ query }: any) => {
      const {
        page = 1,
        pageSize = 10,
        name,
        type,
        status,
        dateRange,
      } = query || {}

      let filteredReports = [...reports]

      // 筛选条件
      if (name) {
        filteredReports = filteredReports.filter((item) =>
          item.name.toLowerCase().includes(name.toLowerCase())
        )
      }
      if (type) {
        filteredReports = filteredReports.filter((item) => item.type === type)
      }
      if (status) {
        filteredReports = filteredReports.filter((item) => item.status === status)
      }
      if (dateRange && Array.isArray(dateRange)) {
        const [startDate, endDate] = dateRange
        filteredReports = filteredReports.filter((item) => {
          const itemDate = new Date(item.createdAt).getTime()
          const start = new Date(startDate).getTime()
          const end = new Date(endDate).getTime() + 24 * 60 * 60 * 1000 // 包含结束日期
          return itemDate >= start && itemDate <= end
        })
      }

      // 排序（创建时间倒序）
      filteredReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      const total = filteredReports.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredReports.slice(start, end)

      return {
        code: 200,
        data: {
          list,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
        } as PageResult<any>,
        message: 'success',
      }
    },
  },

  /**
   * 获取报表详情
   */
  {
    url: '/api/report/:id',
    method: 'get',
    response: ({ query }: any) => {
      const { id } = query
      const report = reports.find((item) => item.id === Number(id))
      if (!report) {
        return {
          code: 404,
          data: null,
          message: '报表不存在',
        }
      }
      return {
        code: 200,
        data: report,
        message: 'success',
      }
    },
  },

  /**
   * 创建报表生成任务
   */
  {
    url: '/api/report',
    method: 'post',
    response: ({ body }: any) => {
      const { name, type, dateRange, format, includeData, description } = body

      const [startDate, endDate] = dateRange
      const newReport = {
        id: nextReportId++,
        name,
        type,
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        format,
        status: 'generating',
        creator: '管理员',
        creatorId: 1,
        description,
        includeData,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }

      reports.unshift(newReport)

      // 模拟异步生成过程
      setTimeout(() => {
        const reportIndex = reports.findIndex((r) => r.id === newReport.id)
        if (reportIndex !== -1) {
          reports[reportIndex].status = Math.random() > 0.1 ? 'completed' : 'failed'
          if (reports[reportIndex].status === 'completed') {
            reports[reportIndex].fileSize = Math.floor(Math.random() * 1000000) + 100000
            reports[reportIndex].filePath = `/reports/${type}_${newReport.id}.${format}`
          }
          reports[reportIndex].updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
      }, 3000 + Math.random() * 5000) // 3-8秒后完成

      return {
        code: 200,
        data: newReport,
        message: '报表生成任务已提交',
      }
    },
  },

  /**
   * 重新生成报表
   */
  {
    url: '/report/:id/regenerate',
    method: 'post',
    response: ({ query }: any) => {
      const { id } = query
      const index = reports.findIndex((item) => item.id === Number(id))
      if (index === -1) {
        return {
          code: 404,
          data: null,
          message: '报表不存在',
        }
      }

      reports[index].status = 'generating'
      reports[index].updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')

      // 模拟重新生成过程
      setTimeout(() => {
        const reportIndex = reports.findIndex((r) => r.id === Number(id))
        if (reportIndex !== -1) {
          reports[reportIndex].status = Math.random() > 0.05 ? 'completed' : 'failed'
          if (reports[reportIndex].status === 'completed') {
            reports[reportIndex].fileSize = Math.floor(Math.random() * 1000000) + 100000
          }
          reports[reportIndex].updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
      }, 2000 + Math.random() * 3000) // 2-5秒后完成

      return {
        code: 200,
        data: reports[index],
        message: '重新生成任务已提交',
      }
    },
  },

  /**
   * 删除报表
   */
  {
    url: '/report/:id',
    method: 'delete',
    response: ({ query }: any) => {
      const { id } = query
      const index = reports.findIndex((item) => item.id === Number(id))
      if (index === -1) {
        return {
          code: 404,
          data: null,
          message: '报表不存在',
        }
      }

      reports.splice(index, 1)

      return {
        code: 200,
        data: null,
        message: '删除成功',
      }
    },
  },

  /**
   * 批量删除报表
   */
  {
    url: '/report/batch',
    method: 'delete',
    response: ({ body }: any) => {
      const { ids } = body
      reports = reports.filter((item) => !ids.includes(item.id))

      return {
        code: 200,
        data: null,
        message: '批量删除成功',
      }
    },
  },

  /**
   * 下载报表
   */
  {
    url: '/report/:id/download',
    method: 'get',
    response: ({ query }: any) => {
      const { id } = query
      const report = reports.find((item) => item.id === Number(id))
      if (!report) {
        return {
          code: 404,
          data: null,
          message: '报表不存在',
        }
      }

      if (report.status !== 'completed') {
        return {
          code: 400,
          data: null,
          message: '报表尚未生成完成',
        }
      }

      return {
        code: 200,
        data: {
          downloadUrl: report.filePath,
          fileName: `${report.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.${report.format}`,
          fileSize: report.fileSize || 0,
        },
        message: 'success',
      }
    },
  },

  /**
   * 获取报表统计数据
   */
  {
    url: '/report/statistics',
    method: 'get',
    response: () => {
      const today = new Date().toISOString().slice(0, 10)
      const thisMonth = new Date().toISOString().slice(0, 7)

      const todayReports = reports.filter(r => r.createdAt.startsWith(today)).length
      const thisMonthReports = reports.filter(r => r.createdAt.startsWith(thisMonth)).length
      const completedReports = reports.filter(r => r.status === 'completed').length
      const generatingReports = reports.filter(r => r.status === 'generating').length
      const failedReports = reports.filter(r => r.status === 'failed').length

      const typeStats = {
        sales: reports.filter(r => r.type === 'sales').length,
        user: reports.filter(r => r.type === 'user').length,
        content: reports.filter(r => r.type === 'content').length,
        visit: reports.filter(r => r.type === 'visit').length,
        financial: reports.filter(r => r.type === 'financial').length,
      }

      return {
        code: 200,
        data: {
          totalCount: reports.length,
          generatingCount: generatingReports,
          completedCount: completedReports,
          failedCount: failedReports,
          todayGeneratedCount: todayReports,
          monthGeneratedCount: thisMonthReports,
          totalDownloads: Math.floor(Math.random() * 1000) + 500,
          popularTypes: Object.entries(typeStats).map(([type, count]) => ({
            type,
            count,
          })),
        },
        message: 'success',
      }
    },
  },

] as MockMethod[]
