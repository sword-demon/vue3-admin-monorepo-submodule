/**
 * 内容管理模块 Mock 数据
 */

import { MockMethod } from 'vite-plugin-mock'
import type {
  Article,
  ArticleListParams,
  ArticleCreateParams,
  ArticleUpdateParams,
  Category,
  CategoryListParams,
  CategoryCreateParams,
  Tag,
  TagListParams,
  TagCreateParams,
  ArticleStatistics,
} from '@/types/content'
import { ArticleStatus } from '@/types/content'
import type { PageResult } from '@/types/system'

/**
 * 生成分类数据
 */
const generateCategories = (): Category[] => {
  return [
    {
      id: 1,
      name: '前端开发',
      slug: 'frontend',
      description: '前端技术相关文章',
      sort: 1,
      articleCount: 25,
      createdAt: '2024-01-01 10:00:00',
      updatedAt: '2024-01-01 10:00:00',
    },
    {
      id: 2,
      name: '后端开发',
      slug: 'backend',
      description: '后端技术相关文章',
      sort: 2,
      articleCount: 18,
      createdAt: '2024-01-01 10:00:00',
      updatedAt: '2024-01-01 10:00:00',
    },
    {
      id: 3,
      name: '数据库',
      slug: 'database',
      description: '数据库技术相关文章',
      sort: 3,
      articleCount: 12,
      createdAt: '2024-01-01 10:00:00',
      updatedAt: '2024-01-01 10:00:00',
    },
    {
      id: 4,
      name: '运维部署',
      slug: 'devops',
      description: 'DevOps和运维相关文章',
      sort: 4,
      articleCount: 8,
      createdAt: '2024-01-01 10:00:00',
      updatedAt: '2024-01-01 10:00:00',
    },
    {
      id: 5,
      name: '架构设计',
      slug: 'architecture',
      description: '系统架构和设计模式',
      sort: 5,
      articleCount: 15,
      createdAt: '2024-01-01 10:00:00',
      updatedAt: '2024-01-01 10:00:00',
    },
  ]
}

/**
 * 生成标签数据
 */
const generateTags = (): Tag[] => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#00d9ff', '#ff6a00']
  const tags = [
    'Vue3',
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'Java',
    'Go',
    'MySQL',
    'Redis',
    'MongoDB',
    'Docker',
    'Kubernetes',
    '微服务',
    '性能优化',
    '设计模式',
  ]

  return tags.map((name, index) => ({
    id: index + 1,
    name,
    slug: name.toLowerCase().replace(/\./g, '-'),
    color: colors[index % colors.length],
    articleCount: Math.floor(Math.random() * 20) + 5,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  }))
}

/**
 * 生成文章数据
 */
const generateArticles = (categories: Category[], tags: Tag[]): Article[] => {
  const articles: Article[] = []

  const titles = [
    'Vue3 + TypeScript 企业级项目实战指南',
    'React Hooks 最佳实践与性能优化',
    'Node.js 微服务架构设计与实现',
    'Python 异步编程完全指南',
    'MySQL 索引优化实战技巧',
    'Redis 缓存设计模式详解',
    'Docker 容器化部署最佳实践',
    'Kubernetes 集群管理与监控',
    '微服务架构下的服务治理',
    'TypeScript 高级类型系统详解',
    '前端性能优化实战总结',
    '设计模式在实际项目中的应用',
    'MongoDB 聚合管道完全指南',
    'Go 并发编程模式与实践',
    'Java Spring Boot 微服务开发',
    'Vue3 Composition API 深入浅出',
    'React Server Components 实战',
    'GraphQL API 设计最佳实践',
    '分布式系统一致性解决方案',
    'WebAssembly 性能优化技术',
  ]

  const authors = ['张三', '李四', '王五', '赵六', '钱七']

  for (let i = 0; i < 50; i++) {
    const category = categories[i % categories.length]
    const author = authors[i % authors.length]
    const status = i % 5 === 0 ? ArticleStatus.DRAFT : i % 10 === 0 ? ArticleStatus.ARCHIVED : ArticleStatus.PUBLISHED
    const title = titles[i % titles.length] + (i > 19 ? ` (第${Math.floor(i / 20) + 1}部分)` : '')

    // 随机选择2-4个标签
    const articleTags: Tag[] = []
    const tagCount = Math.floor(Math.random() * 3) + 2
    const usedTagIds = new Set<number>()

    while (articleTags.length < tagCount) {
      const randomTag = tags[Math.floor(Math.random() * tags.length)]
      if (!usedTagIds.has(randomTag.id)) {
        articleTags.push(randomTag)
        usedTagIds.add(randomTag.id)
      }
    }

    const publishedDate = new Date(2024, 0, 1 + i)
    const createdDate = new Date(publishedDate.getTime() - 86400000) // 创建时间早一天

    articles.push({
      id: i + 1,
      title,
      slug: `article-${i + 1}`,
      summary: `这是一篇关于${title}的文章摘要。本文将详细介绍相关技术要点、最佳实践以及实战经验分享。`,
      content: `# ${title}\n\n## 引言\n\n这是文章的详细内容...\n\n## 核心概念\n\n这里是核心概念的介绍...\n\n## 实战案例\n\n这里是实战案例的展示...`,
      cover: `https://picsum.photos/seed/${i + 1}/800/450`,
      author,
      authorId: (i % authors.length) + 1,
      categoryId: category.id,
      categoryName: category.name,
      tags: articleTags,
      tagIds: articleTags.map((t) => t.id),
      status,
      viewCount: Math.floor(Math.random() * 10000) + 100,
      likeCount: Math.floor(Math.random() * 1000) + 10,
      commentCount: Math.floor(Math.random() * 100) + 1,
      isTop: i < 3 && status === ArticleStatus.PUBLISHED,
      isRecommend: i < 10 && status === ArticleStatus.PUBLISHED,
      publishedAt: status === ArticleStatus.PUBLISHED ? publishedDate.toISOString().slice(0, 19).replace('T', ' ') : undefined,
      createdAt: createdDate.toISOString().slice(0, 19).replace('T', ' '),
      updatedAt: publishedDate.toISOString().slice(0, 19).replace('T', ' '),
    })
  }

  return articles
}

// 生成初始数据
const categories = generateCategories()
let tags = generateTags()
let articles = generateArticles(categories, tags)

// 触发mock重新加载 - 修复排序更新问题 - 2025-10-18 11:15:00
// 修复路由参数传递问题 - vite-plugin-mock需要使用query而不是params - 2025-10-18 11:22:00

// 自增ID
let nextArticleId = articles.length + 1
let nextCategoryId = categories.length + 1
let nextTagId = tags.length + 1

export default [
  /**
   * ========== 文章管理 ==========
   */

  /**
   * 获取文章列表
   */
  {
    url: '/api/content/article/list',
    method: 'get',
    response: ({ query }: { query: ArticleListParams }) => {
      const {
        page = 1,
        pageSize = 10,
        title,
        author,
        categoryId,
        tagId,
        status,
        isTop,
        isRecommend,
      } = query

      let filteredArticles = [...articles]

      // 筛选条件
      if (title) {
        filteredArticles = filteredArticles.filter((item) =>
          item.title.toLowerCase().includes(title.toLowerCase())
        )
      }
      if (author) {
        filteredArticles = filteredArticles.filter((item) =>
          item.author.toLowerCase().includes(author.toLowerCase())
        )
      }
      if (categoryId) {
        filteredArticles = filteredArticles.filter((item) => item.categoryId === Number(categoryId))
      }
      if (tagId) {
        filteredArticles = filteredArticles.filter((item) => item.tagIds.includes(Number(tagId)))
      }
      if (status !== undefined) {
        filteredArticles = filteredArticles.filter((item) => item.status === Number(status))
      }
      if (isTop !== undefined) {
        filteredArticles = filteredArticles.filter((item) => item.isTop === (isTop === 'true' || isTop === true))
      }
      if (isRecommend !== undefined) {
        filteredArticles = filteredArticles.filter(
          (item) => item.isRecommend === (isRecommend === 'true' || isRecommend === true)
        )
      }

      // 排序(置顶优先,然后按发布时间倒序)
      filteredArticles.sort((a, b) => {
        if (a.isTop !== b.isTop) return a.isTop ? -1 : 1
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
      })

      const total = filteredArticles.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredArticles.slice(start, end)

      return {
        code: 200,
        data: {
          list,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
        } as PageResult<Article>,
        message: 'success',
      }
    },
  },

  /**
   * 获取文章统计
   */
  {
    url: '/api/content/article/statistics',
    method: 'get',
    response: () => {
      const today = new Date().toISOString().slice(0, 10)

      const statistics: ArticleStatistics = {
        totalCount: articles.length,
        publishedCount: articles.filter((a) => a.status === ArticleStatus.PUBLISHED).length,
        draftCount: articles.filter((a) => a.status === ArticleStatus.DRAFT).length,
        archivedCount: articles.filter((a) => a.status === ArticleStatus.ARCHIVED).length,
        todayPublishedCount: articles.filter(
          (a) => a.status === ArticleStatus.PUBLISHED && a.publishedAt?.startsWith(today)
        ).length,
        totalViewCount: articles.reduce((sum, a) => sum + a.viewCount, 0),
        totalLikeCount: articles.reduce((sum, a) => sum + a.likeCount, 0),
        totalCommentCount: articles.reduce((sum, a) => sum + a.commentCount, 0),
      }

      return {
        code: 200,
        data: statistics,
        message: 'success',
      }
    },
  },

  /**
   * 获取文章详情
   */
  {
    url: '/api/content/article/:id',
    method: 'get',
    response: ({ query }: { query?: Record<string, string> }) => {
      const id = query?.id
      if (!id) {
        return {
          code: 400,
          data: null,
          message: '缺少文章ID参数',
        }
      }
      const articleId = Number(id)
      const article = articles.find((item) => item.id === articleId)
      if (!article) {
        return {
          code: 404,
          data: null,
          message: '文章不存在',
        }
      }
      return {
        code: 200,
        data: article,
        message: 'success',
      }
    },
  },

  /**
   * 创建文章
   */
  {
    url: '/api/content/article',
    method: 'post',
    response: ({ body }: { body: ArticleCreateParams }) => {
      const category = categories.find((c) => c.id === body.categoryId)
      const articleTags = tags.filter((t) => body.tagIds.includes(t.id))

      const newArticle: Article = {
        id: nextArticleId++,
        ...body,
        categoryName: category?.name || '',
        tags: articleTags,
        author: '管理员',
        authorId: 1,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        publishedAt:
          body.status === ArticleStatus.PUBLISHED
            ? new Date().toISOString().slice(0, 19).replace('T', ' ')
            : undefined,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }

      articles.unshift(newArticle)

      return {
        code: 200,
        data: newArticle,
        message: '创建成功',
      }
    },
  },

  /**
   * 更新文章
   */
  {
    url: '/api/content/article/:id',
    method: 'put',
    response: ({ query, body }: { query?: Record<string, string>; body: ArticleUpdateParams }) => {
      const id = query?.id
      const articleId = id ? Number(id) : body.id
      const index = articles.findIndex((item) => item.id === articleId)
      if (index === -1) {
        return {
          code: 404,
          data: null,
          message: '文章不存在',
        }
      }

      const updateData = body as Partial<ArticleUpdateParams>
      articles[index] = {
        ...articles[index],
        ...updateData,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }

      // 如果状态更新为已发布，设置发布时间
      if (updateData.status === ArticleStatus.PUBLISHED && !articles[index].publishedAt) {
        articles[index].publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      if (updateData.categoryId) {
        const category = categories.find((c) => c.id === updateData.categoryId)
        if (category) {
          articles[index].categoryName = category.name
        }
      }

      if (updateData.tagIds) {
        articles[index].tags = tags.filter((t) => updateData.tagIds?.includes(t.id))
      }

      return {
        code: 200,
        data: articles[index],
        message: '更新成功',
      }
    },
  },
  /**
   * 删除文章
   */
  {
    url: '/api/content/article/:id',
    method: 'delete',
    response: ({ query }: any) => {
      const { id } = query || {}
      const index = articles.findIndex((item) => item.id === Number(id))
      if (index === -1) {
        return {
          code: 404,
          data: null,
          message: '文章不存在',
        }
      }

      articles.splice(index, 1)

      return {
        code: 200,
        data: null,
        message: '删除成功',
      }
    },
  },

  /**
   * 批量删除文章
   */
  {
    url: '/api/content/article/batch',
    method: 'delete',
    response: ({ body }: any) => {
      const { ids } = body
      articles = articles.filter((item) => !ids.includes(item.id))

      return {
        code: 200,
        data: null,
        message: '批量删除成功',
      }
    },
  },

  /**
   * ========== 分类管理 ==========
   */

  /**
   * 获取分类列表(分页)
   */
  {
    url: '/api/content/category/list',
    method: 'get',
    response: ({ query }: { query: CategoryListParams }) => {
      const { page = 1, pageSize = 10, name } = query

      let filteredCategories = [...categories]

      if (name) {
        filteredCategories = filteredCategories.filter((item) =>
          item.name.toLowerCase().includes(name.toLowerCase())
        )
      }

      filteredCategories.sort((a, b) => a.sort - b.sort)

      const total = filteredCategories.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredCategories.slice(start, end)

      return {
        code: 200,
        data: {
          list,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
        } as PageResult<Category>,
        message: 'success',
      }
    },
  },

  /**
   * 获取所有分类(不分页)
   */
  {
    url: '/api/content/category/all',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [...categories].sort((a, b) => a.sort - b.sort),
        message: 'success',
      }
    },
  },

  /**
   * 获取分类详情
   */
  {
    url: '/api/content/category/:id',
    method: 'get',
    response: ({ query }: any) => {
      const { id } = query || {}
      const category = categories.find((item) => item.id === Number(id))
      if (!category) {
        return {
          code: 404,
          data: null,
          message: '分类不存在',
        }
      }
      return {
        code: 200,
        data: category,
        message: 'success',
      }
    },
  },

  /**
   * 创建分类
   */
  {
    url: '/api/content/category',
    method: 'post',
    response: ({ body }: { body: CategoryCreateParams }) => {
      const newCategory: Category = {
        id: nextCategoryId++,
        ...body,
        articleCount: 0,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }

      categories.push(newCategory)

      return {
        code: 200,
        data: newCategory,
        message: '创建成功',
      }
    },
  },

  /**
   * 更新分类
   */
  {
    url: '/api/content/category/:id',
    method: 'put',
    response: ({ query, body }: any) => {
      const { id } = query || {}

      const categoryId = Number(id)
      if (!categoryId || isNaN(categoryId)) {
        return {
          code: 400,
          data: null,
          message: '无效的分类ID',
        }
      }

      const index = categories.findIndex((item) => item.id === categoryId)
      if (index === -1) {
        return {
          code: 404,
          data: null,
          message: '分类不存在',
        }
      }

      categories[index] = {
        ...categories[index],
        ...body,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }

      return {
        code: 200,
        data: categories[index],
        message: '更新成功',
      }
    },
  },

  /**
   * 删除分类
   */
  {
    url: '/api/content/category/:id',
    method: 'delete',
    response: ({ query }: any) => {
      const { id } = query || {}
      const categoryId = Number(id)
      const index = categories.findIndex((item) => item.id === categoryId)

      if (index === -1) {
        return {
          code: 404,
          data: null,
          message: '分类不存在',
        }
      }

      // 检查是否有文章使用该分类
      const hasArticles = articles.some((a) => a.categoryId === categoryId)
      if (hasArticles) {
        return {
          code: 400,
          data: null,
          message: '该分类下还有文章,无法删除',
        }
      }

      categories.splice(index, 1)

      return {
        code: 200,
        data: null,
        message: '删除成功',
      }
    },
  },

  /**
   * ========== 标签管理 ==========
   */

  /**
   * 获取标签列表(分页)
   */
  {
    url: '/api/content/tag/list',
    method: 'get',
    response: ({ query }: { query: TagListParams }) => {
      const { page = 1, pageSize = 10, name } = query

      let filteredTags = [...tags]

      if (name) {
        filteredTags = filteredTags.filter((item) =>
          item.name.toLowerCase().includes(name.toLowerCase())
        )
      }

      const total = filteredTags.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredTags.slice(start, end)

      return {
        code: 200,
        data: {
          list,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
        } as PageResult<Tag>,
        message: 'success',
      }
    },
  },

  /**
   * 获取所有标签(不分页)
   */
  {
    url: '/api/content/tag/all',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: tags,
        message: 'success',
      }
    },
  },

  /**
   * 获取标签详情
   */
  {
    url: '/api/content/tag/:id',
    method: 'get',
    response: ({ query }: any) => {
      const { id } = query || {}
      const tag = tags.find((item) => item.id === Number(id))
      if (!tag) {
        return {
          code: 404,
          data: null,
          message: '标签不存在',
        }
      }
      return {
        code: 200,
        data: tag,
        message: 'success',
      }
    },
  },

  /**
   * 创建标签
   */
  {
    url: '/api/content/tag',
    method: 'post',
    response: ({ body }: { body: TagCreateParams }) => {
      const newTag: Tag = {
        id: nextTagId++,
        ...body,
        articleCount: 0,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }

      tags.push(newTag)

      return {
        code: 200,
        data: newTag,
        message: '创建成功',
      }
    },
  },

  /**
   * 更新标签
   */
  {
    url: '/api/content/tag/:id',
    method: 'put',
    response: ({ query, body }: any) => {
      const { id } = query || {}
      const index = tags.findIndex((item) => item.id === Number(id))
      if (index === -1) {
        return {
          code: 404,
          data: null,
          message: '标签不存在',
        }
      }

      tags[index] = {
        ...tags[index],
        ...body,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }

      return {
        code: 200,
        data: tags[index],
        message: '更新成功',
      }
    },
  },

  /**
   * 删除标签
   */
  {
    url: '/api/content/tag/:id',
    method: 'delete',
    response: ({ query }: any) => {
      const { id } = query || {}
      const index = tags.findIndex((item) => item.id === Number(id))
      if (index === -1) {
        return {
          code: 404,
          data: null,
          message: '标签不存在',
        }
      }

      tags.splice(index, 1)

      return {
        code: 200,
        data: null,
        message: '删除成功',
      }
    },
  },

  /**
   * 批量删除标签
   */
  {
    url: '/api/content/tag/batch',
    method: 'delete',
    response: ({ body }: any) => {
      const { ids } = body
      tags = tags.filter((item) => !ids.includes(item.id))

      return {
        code: 200,
        data: null,
        message: '批量删除成功',
      }
    },
  },
] as MockMethod[]
