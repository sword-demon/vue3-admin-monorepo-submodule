import type {
  OverviewStatistics,
  TrendData,
  Activity,
} from '@/api/analytics'
import type { ArticleStatistics, Article, Tag } from '@/types/content'

const now = new Date()

const buildDateString = (date: Date): string => date.toISOString().slice(0, 19).replace('T', ' ')

const baseTags: Tag[] = [
  { id: 1, name: 'Vue3', slug: 'vue3', color: '#409EFF', articleCount: 42, createdAt: buildDateString(now), updatedAt: buildDateString(now) },
  { id: 2, name: 'TypeScript', slug: 'typescript', color: '#2F74C0', articleCount: 38, createdAt: buildDateString(now), updatedAt: buildDateString(now) },
  { id: 3, name: '工程化', slug: 'engineering', color: '#E6A23C', articleCount: 21, createdAt: buildDateString(now), updatedAt: buildDateString(now) },
]

const defaultArticles: Article[] = [
  {
    id: 1,
    title: 'Vue3 + TypeScript 企业级项目实战指南',
    slug: 'vue3-typescript-enterprise-guide',
    summary: '全面梳理 Vue3 + TS 企业级项目搭建流程与规范。',
    content: '',
    cover: '',
    author: '超级管理员',
    authorId: 1,
    categoryId: 1,
    categoryName: '前端开发',
    tags: baseTags,
    tagIds: baseTags.map((tag) => tag.id),
    status: 2,
    viewCount: 3245,
    likeCount: 256,
    commentCount: 42,
    isTop: true,
    isRecommend: true,
    publishedAt: buildDateString(new Date(now.getTime() - 86400000)),
    createdAt: buildDateString(new Date(now.getTime() - 86400000)),
    updatedAt: buildDateString(now),
  },
  {
    id: 2,
    title: 'React Hooks 最佳实践与性能优化',
    slug: 'react-hooks-best-practice',
    summary: '手把手优化 React 组件性能与可维护性。',
    content: '',
    cover: '',
    author: '管理员',
    authorId: 2,
    categoryId: 1,
    categoryName: '前端开发',
    tags: baseTags.slice(0, 2),
    tagIds: baseTags.slice(0, 2).map((tag) => tag.id),
    status: 2,
    viewCount: 2891,
    likeCount: 198,
    commentCount: 35,
    isTop: false,
    isRecommend: true,
    publishedAt: buildDateString(new Date(now.getTime() - 2 * 86400000)),
    createdAt: buildDateString(new Date(now.getTime() - 2 * 86400000)),
    updatedAt: buildDateString(now),
  },
  {
    id: 3,
    title: 'Node.js 微服务架构设计与实现',
    slug: 'nodejs-microservice-design',
    summary: '微服务拆分策略、通讯模式与部署实践。',
    content: '',
    cover: '',
    author: '技术团队',
    authorId: 3,
    categoryId: 2,
    categoryName: '后端开发',
    tags: baseTags.slice(1),
    tagIds: baseTags.slice(1).map((tag) => tag.id),
    status: 2,
    viewCount: 2156,
    likeCount: 167,
    commentCount: 28,
    isTop: false,
    isRecommend: true,
    publishedAt: buildDateString(new Date(now.getTime() - 3 * 86400000)),
    createdAt: buildDateString(new Date(now.getTime() - 3 * 86400000)),
    updatedAt: buildDateString(now),
  },
]

export const buildMockArticleStatistics = (): ArticleStatistics => ({
  totalCount: 156,
  publishedCount: 132,
  draftCount: 18,
  archivedCount: 6,
  todayPublishedCount: 8,
  totalViewCount: 48920,
  totalLikeCount: 6234,
  totalCommentCount: 3420,
})

export const buildMockOverviewStatistics = (): OverviewStatistics => ({
  users: {
    total: 1248,
    today: 32,
    thisMonth: 286,
    active: 892,
  },
  content: {
    totalArticles: 156,
    todayArticles: 8,
    totalViews: 4892,
    todayViews: 234,
    totalComments: 342,
    todayComments: 18,
  },
  activities: {
    total: 58,
    today: 17,
    publish: 23,
    comment: 19,
    edit: 16,
  },
  system: {
    uptime: '99.9%',
    responseTime: '125ms',
    errorRate: '0.12%',
    storageUsage: '2.3GB / 10GB',
  },
})

export const buildMockTrendData = (days: number): TrendData[] => {
  const trend: TrendData[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const current = new Date(today)
    current.setDate(current.getDate() - i)

    trend.push({
      date: current.toISOString().slice(0, 10),
      views: 1800 + Math.floor(Math.random() * 1200),
      users: 120 + Math.floor(Math.random() * 80),
      articles: 6 + Math.floor(Math.random() * 4),
      comments: 25 + Math.floor(Math.random() * 20),
    })
  }

  return trend
}

export const buildMockHotArticles = (): Article[] => {
  const articlePool = [
    ...defaultArticles,
    {
      ...defaultArticles[0],
      id: 4,
      title: 'Python 异步编程完全指南',
      slug: 'python-async-guide',
      categoryId: 3,
      categoryName: '后端开发',
      viewCount: 1923,
      likeCount: 145,
      commentCount: 22,
    },
    {
      ...defaultArticles[0],
      id: 5,
      title: 'MySQL 索引优化实战技巧',
      slug: 'mysql-index-optimization',
      categoryId: 3,
      categoryName: '数据库',
      viewCount: 1876,
      likeCount: 134,
      commentCount: 19,
    },
    {
      ...defaultArticles[0],
      id: 6,
      title: 'Redis 高并发缓存架构实践',
      slug: 'redis-high-concurrency',
      categoryId: 2,
      categoryName: '后端开发',
      viewCount: 1765,
      likeCount: 128,
      commentCount: 21,
    },
    {
      ...defaultArticles[0],
      id: 7,
      title: 'Kubernetes 集群弹性伸缩策略',
      slug: 'kubernetes-auto-scaling',
      categoryId: 4,
      categoryName: '运维部署',
      viewCount: 1652,
      likeCount: 117,
      commentCount: 18,
    },
    {
      ...defaultArticles[0],
      id: 8,
      title: '前端性能优化 100 条实践清单',
      slug: 'frontend-performance-checklist',
      categoryId: 1,
      categoryName: '前端开发',
      viewCount: 1589,
      likeCount: 112,
      commentCount: 26,
    },
    {
      ...defaultArticles[0],
      id: 9,
      title: '微前端架构设计模式解析',
      slug: 'micro-frontend-architecture',
      categoryId: 1,
      categoryName: '前端开发',
      viewCount: 1492,
      likeCount: 104,
      commentCount: 17,
    },
    {
      ...defaultArticles[0],
      id: 10,
      title: 'DevOps 持续交付流水线落地指南',
      slug: 'devops-ci-cd-guide',
      categoryId: 4,
      categoryName: '运维部署',
      viewCount: 1405,
      likeCount: 95,
      commentCount: 14,
    },
  ]

  return articlePool.map((article, index) => ({
    ...article,
    id: index + 1,
    createdAt: buildDateString(new Date(now.getTime() - (index + 1) * 12 * 60 * 60 * 1000)),
    updatedAt: buildDateString(new Date(now.getTime() - index * 6 * 60 * 60 * 1000)),
  }))
}

export const buildMockActivities = (): Activity[] => [
  {
    id: 1,
    type: 'publish',
    content: '发布了新文章《Vue3组合式API最佳实践》',
    user: '张三',
    time: buildDateString(new Date(now.getTime() - 5 * 60 * 1000)),
    timestamp: now.getTime() - 5 * 60 * 1000,
  },
  {
    id: 2,
    type: 'comment',
    content: '评论了文章《React性能优化指南》',
    user: '李四',
    time: buildDateString(new Date(now.getTime() - 15 * 60 * 1000)),
    timestamp: now.getTime() - 15 * 60 * 1000,
  },
  {
    id: 3,
    type: 'edit',
    content: '编辑了文章《TypeScript高级类型系统》',
    user: '王五',
    time: buildDateString(new Date(now.getTime() - 45 * 60 * 1000)),
    timestamp: now.getTime() - 45 * 60 * 1000,
  },
  {
    id: 4,
    type: 'like',
    content: '点赞了文章《微服务架构设计模式》',
    user: '赵六',
    time: buildDateString(new Date(now.getTime() - 90 * 60 * 1000)),
    timestamp: now.getTime() - 90 * 60 * 1000,
  },
  {
    id: 5,
    type: 'share',
    content: '分享了文章《前端工程化实践指南》',
    user: '钱七',
    time: buildDateString(new Date(now.getTime() - 2 * 60 * 60 * 1000)),
    timestamp: now.getTime() - 2 * 60 * 60 * 1000,
  },
]

export const buildMockSystemStats = () => buildMockOverviewStatistics().system

export const buildMockArticleList = (): Article[] => buildMockHotArticles()
