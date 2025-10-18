/**
 * 数据分析模块 Mock 数据
 * 创建时间: 2025-10-18
 * 最后更新: 2025-10-18 - 完善数据概览页面功能
 */

import { MockMethod } from 'vite-plugin-mock'
import type { PageResult } from '@/types/system'
import type { User } from '@/types/system'

// 生成用户数据
const generateUsers = () => {
  const users = []
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
  const departments = ['技术部', '产品部', '运营部', '市场部', '人事部']

  for (let i = 1; i <= 156; i++) {
    const joinDate = new Date(2023, 0, Math.floor(Math.random() * 365))
    const lastLoginDate = new Date()
    lastLoginDate.setDate(lastLoginDate.getDate() - Math.floor(Math.random() * 30))

    users.push({
      id: i,
      username: `user${i}`,
      realName: names[i % names.length] + i,
      department: departments[i % departments.length],
      avatar: `https://picsum.photos/seed/user${i}/100/100`,
      joinDate: joinDate.toISOString().slice(0, 10),
      lastLoginAt: lastLoginDate.toISOString().slice(0, 19).replace('T', ' '),
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      articleCount: Math.floor(Math.random() * 20),
      commentCount: Math.floor(Math.random() * 50),
      createdAt: joinDate.toISOString().slice(0, 19).replace('T', ' '),
    })
  }

  return users
}

// 生成访问趋势数据
const generateTrendData = (days: number) => {
  const data = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().slice(0, 10),
      views: Math.floor(Math.random() * 5000) + 1000,
      users: Math.floor(Math.random() * 500) + 100,
      articles: Math.floor(Math.random() * 20) + 5,
      comments: Math.floor(Math.random() * 100) + 20,
    })
  }

  return data
}

// 生成动态数据
const generateActivities = () => {
  const activities = []
  const types = ['publish', 'comment', 'edit', 'like', 'share']
  const actions = {
    publish: '发布了新文章',
    comment: '评论了文章',
    edit: '更新了文章',
    like: '点赞了文章',
    share: '分享了文章'
  }

  const articles = [
    'Vue3 Composition API 最佳实践',
    'TypeScript 5.0 新特性解析',
    'React vs Vue 性能对比',
    '前端工程化实践指南',
    '微服务架构设计模式',
    'Node.js 性能优化技巧',
    'CSS Grid 布局完全指南',
    'Webpack 5 配置详解',
    'Docker 容器化部署',
    'GraphQL API 设计实践'
  ]

  const users = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']

  for (let i = 0; i < 50; i++) {
    const date = new Date()
    date.setHours(date.getHours() - Math.floor(Math.random() * 72)) // 最近3天

    const type = types[Math.floor(Math.random() * types.length)]
    const article = articles[Math.floor(Math.random() * articles.length)]
    const user = users[Math.floor(Math.random() * users.length)]

    activities.push({
      id: i + 1,
      type,
      content: `${actions[type]}《${article}》`,
      user,
      time: date.toISOString().slice(0, 16).replace('T', ' '),
      timestamp: date.getTime(),
    })
  }

  return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20)
}

// 初始化数据
const users = generateUsers()
const activities = generateActivities()

export default [
  /**
   * 获取用户统计
   */
  {
    url: '/api/analytics/user/statistics',
    method: 'get',
    response: () => {
      const today = new Date().toISOString().slice(0, 10)
      const thisMonth = new Date().toISOString().slice(0, 7)

      const todayUsers = users.filter(u => u.createdAt.startsWith(today)).length
      const thisMonthUsers = users.filter(u => u.createdAt.startsWith(thisMonth)).length
      const activeUsers = users.filter(u => u.status === 'active').length
      const totalArticles = users.reduce((sum, u) => sum + u.articleCount, 0)
      const totalComments = users.reduce((sum, u) => sum + u.commentCount, 0)

      return {
        code: 200,
        data: {
          totalUsers: users.length,
          todayUsers,
          thisMonthUsers,
          activeUsers,
          inactiveUsers: users.length - activeUsers,
          totalArticles,
          totalComments,
        },
        message: 'success',
      }
    },
  },

  /**
   * 获取用户列表
   */
  {
    url: '/api/analytics/user/list',
    method: 'get',
    response: ({ query }: any) => {
      const {
        page = 1,
        pageSize = 10,
        department,
        status,
        keyword,
      } = query

      let filteredUsers: User[] = [...users]

      // 筛选条件
      if (department) {
        filteredUsers = filteredUsers.filter(u => u.department === department)
      }
      if (status) {
        filteredUsers = filteredUsers.filter(u => u.status === status)
      }
      if (keyword) {
        filteredUsers = filteredUsers.filter(u =>
          u.realName.toLowerCase().includes(keyword.toLowerCase()) ||
          u.username.toLowerCase().includes(keyword.toLowerCase())
        )
      }

      // 排序（最后登录时间倒序）
      filteredUsers.sort((a, b) => new Date(b.lastLoginAt).getTime() - new Date(a.lastLoginAt).getTime())

      const total = filteredUsers.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredUsers.slice(start, end)

      return {
        code: 200,
        data: {
          list,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
        } satisfies PageResult<User>,
        message: 'success',
      }
    },
  },

  /**
   * 获取访问趋势数据
   */
  {
    url: '/api/analytics/trend',
    method: 'get',
    response: ({ query }: { query?: { days?: number } }) => {
      const { days = 7 } = query || {}

      const trendData = generateTrendData(Number(days))

      return {
        code: 200,
        data: trendData,
        message: 'success',
      }
    },
  },

  /**
   * 获取热门内容统计
   */
  {
    url: '/api/analytics/content/hot',
    method: 'get',
    response: ({ query }: { query?: { type?: string; limit?: number } }) => {
      const { type: _type = 'article', limit = 10 } = query || {}

      // 这里可以根据类型返回不同的热门内容
      // 目前简单返回文章统计数据
      const hotData = [
        { title: 'Vue3 Composition API 最佳实践', views: 15420, likes: 892, comments: 156 },
        { title: 'TypeScript 5.0 新特性解析', views: 12350, likes: 756, comments: 123 },
        { title: 'React vs Vue 性能对比', views: 10890, likes: 645, comments: 98 },
        { title: '前端工程化实践指南', views: 9230, likes: 523, comments: 87 },
        { title: '微服务架构设计模式', views: 8760, likes: 498, comments: 76 },
        { title: 'Node.js 性能优化技巧', views: 7650, likes: 432, comments: 65 },
        { title: 'CSS Grid 布局完全指南', views: 6890, likes: 387, comments: 54 },
        { title: 'Webpack 5 配置详解', views: 5430, likes: 321, comments: 43 },
        { title: 'Docker 容器化部署', views: 4870, likes: 298, comments: 38 },
        { title: 'GraphQL API 设计实践', views: 4230, likes: 265, comments: 31 },
      ].slice(0, Number(limit))

      return {
        code: 200,
        data: hotData,
        message: 'success',
      }
    },
  },

  /**
   * 获取最新动态
   */
  {
    url: '/api/analytics/activities',
    method: 'get',
    response: ({ query }: any) => {
      const { limit = 20, type } = query

      let filteredActivities = [...activities]

      if (type) {
        filteredActivities = activities.filter(a => a.type === type)
      }

      const limitedActivities = filteredActivities.slice(0, Number(limit))

      return {
        code: 200,
        data: limitedActivities,
        message: 'success',
      }
    },
  },

  /**
   * 获取部门统计
   */
  {
    url: '/api/analytics/department/statistics',
    method: 'get',
    response: () => {
      const departments = ['技术部', '产品部', '运营部', '市场部', '人事部']
      const deptStats = departments.map(dept => {
        const deptUsers = users.filter(u => u.department === dept)
        return {
          department: dept,
          userCount: deptUsers.length,
          activeUsers: deptUsers.filter(u => u.status === 'active').length,
          totalArticles: deptUsers.reduce((sum, u) => sum + u.articleCount, 0),
          totalComments: deptUsers.reduce((sum, u) => sum + u.commentCount, 0),
        }
      })

      return {
        code: 200,
        data: deptStats,
        message: 'success',
      }
    },
  },

  /**
   * 获取系统概览统计
   */
  {
    url: '/api/analytics/overview',
    method: 'get',
    response: () => {
      const today = new Date().toISOString().slice(0, 10)
      const thisMonth = new Date().toISOString().slice(0, 7)

      // 计算今日数据
      const todayUsers = users.filter(u => u.createdAt.startsWith(today)).length
      const todayActivities = activities.filter(a => a.time.startsWith(today))

      // 计算本月数据
      const thisMonthUsers = users.filter(u => u.createdAt.startsWith(thisMonth)).length

      // 计算总数据
      const totalViews = 125680 // 模拟总浏览量
      const todayViews = Math.floor(totalViews * 0.03) // 模拟今日浏览量

      return {
        code: 200,
        data: {
          users: {
            total: users.length,
            today: todayUsers,
            thisMonth: thisMonthUsers,
            active: users.filter(u => u.status === 'active').length,
          },
          content: {
            totalArticles: 50, // 从content mock获取
            todayArticles: 2,
            totalViews,
            todayViews,
            totalComments: 389, // 从content mock获取
            todayComments: 8,
          },
          activities: {
            total: activities.length,
            today: todayActivities.length,
            publish: activities.filter(a => a.type === 'publish').length,
            comment: activities.filter(a => a.type === 'comment').length,
            edit: activities.filter(a => a.type === 'edit').length,
          },
          system: {
            uptime: '99.9%',
            responseTime: '125ms',
            errorRate: '0.02%',
            storageUsage: '2.3GB / 10GB',
          }
        },
        message: 'success',
      }
    },
  },

] as MockMethod[]
