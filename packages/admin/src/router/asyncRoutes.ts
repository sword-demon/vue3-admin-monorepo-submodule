/**
 * 异步路由配置
 * 需要根据权限动态加载的路由
 */

import type { RouteRecordRaw } from 'vue-router'
import { ClassicLayout } from '@/layouts'

/**
 * 异步路由(需要权限控制的路由)
 */
export const asyncRoutes: RouteRecordRaw[] = [
  // 系统管理
  {
    path: '/system',
    component: ClassicLayout,
    redirect: { name: 'SystemUser' },
    meta: {
      title: '系统管理',
      icon: 'i-ep-setting',
      roles: ['admin', 'super_admin'], // 需要管理员角色
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'i-ep-user',
          permissions: ['system:user:list'], // 需要用户列表权限
        },
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'i-ep-avatar',
          permissions: ['system:role:list'], // 需要角色列表权限
        },
      },
      {
        path: 'menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'i-ep-menu',
          permissions: ['system:menu:list'], // 需要菜单列表权限
        },
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: () => import('@/views/system/settings/index.vue'),
        meta: {
          title: '系统设置',
          icon: 'i-ep-setting',
          permissions: ['system:settings:view'],
        },
      },
    ],
  },

  // 内容管理
  {
    path: '/content',
    component: ClassicLayout,
    redirect: { name: 'ContentArticle' },
    meta: {
      title: '内容管理',
      icon: 'i-ep-document',
      roles: ['admin', 'editor'], // 管理员和编辑者可访问
    },
    children: [
      {
        path: 'article',
        name: 'ContentArticle',
        component: () => import('@/views/content/article/index.vue'),
        meta: {
          title: '文章管理',
          icon: 'i-ep-reading',
          permissions: ['content:article:list'],
        },
      },
      {
        path: 'category',
        name: 'ContentCategory',
        component: () => import('@/views/content/category/index.vue'),
        meta: {
          title: '分类管理',
          icon: 'i-ep-collection-tag',
          permissions: ['content:category:list'],
        },
      },
    ],
  },

  // 数据分析
  {
    path: '/analytics',
    component: ClassicLayout,
    redirect: { name: 'AnalyticsOverview' },
    meta: {
      title: '数据分析',
      icon: 'i-ep-data-analysis',
      roles: ['admin', 'analyst'], // 管理员和分析师可访问
    },
    children: [
      {
        path: 'overview',
        name: 'AnalyticsOverview',
        component: () => import('@/views/analytics/overview/index.vue'),
        meta: {
          title: '数据概览',
          icon: 'i-ep-data-line',
          permissions: ['analytics:overview:view'],
        },
      },
      {
        path: 'report',
        name: 'AnalyticsReport',
        component: () => import('@/views/analytics/report/index.vue'),
        meta: {
          title: '报表管理',
          icon: 'i-ep-document-checked',
          permissions: ['analytics:report:view'],
        },
      },
    ],
  },

  // 个人中心(无权限要求,所有登录用户都可访问)
  {
    path: '/profile',
    component: ClassicLayout,
    redirect: { name: 'Profile' },
    meta: {
      title: '个人中心',
      icon: 'i-ep-user',
      hidden: true, // 不在菜单中显示
    },
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人信息',
          icon: 'i-ep-user',
        },
      },
    ],
  },
]

/**
 * 404 路由(必须放在最后)
 */
export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/error/404.vue'),
  meta: {
    title: '404',
    hidden: true,
  },
}
