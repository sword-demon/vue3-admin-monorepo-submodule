/**
 * 系统管理 Mock 接口
 */

import type { MockMethod } from 'vite-plugin-mock'
import { RoleEnum } from '../src/config/rolePermissions'

// 模拟用户列表数据
const userList = [
  {
    id: 1,
    username: 'super_admin',
    realName: '超级管理员',
    email: 'super_admin@example.com',
    phone: '13800138000',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [RoleEnum.SUPER_ADMIN],
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    username: 'admin',
    realName: '管理员',
    email: 'admin@example.com',
    phone: '13800138001',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [RoleEnum.ADMIN],
    status: 1,
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00',
  },
  {
    id: 3,
    username: 'editor',
    realName: '编辑员',
    email: 'editor@example.com',
    phone: '13800138002',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [RoleEnum.EDITOR],
    status: 1,
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00',
  },
  {
    id: 4,
    username: 'user',
    realName: '普通用户',
    email: 'user@example.com',
    phone: '13800138003',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [RoleEnum.USER],
    status: 1,
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-04 10:00:00',
  },
  {
    id: 5,
    username: 'test_user',
    realName: '测试用户',
    email: 'test@example.com',
    phone: '13800138004',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [RoleEnum.USER],
    status: 0, // 禁用状态
    createTime: '2024-01-05 10:00:00',
    updateTime: '2024-01-05 10:00:00',
  },
]

// 模拟角色列表数据
const roleList = [
  {
    id: 1,
    code: RoleEnum.SUPER_ADMIN,
    name: '超级管理员',
    description: '系统内置超级管理员，拥有所有权限',
    status: 1,
    sort: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    code: RoleEnum.ADMIN,
    name: '管理员',
    description: '系统管理员，拥有大部分管理权限',
    status: 1,
    sort: 2,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
  },
  {
    id: 3,
    code: RoleEnum.EDITOR,
    name: '编辑员',
    description: '内容编辑员，负责内容管理',
    status: 1,
    sort: 3,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
  },
  {
    id: 4,
    code: RoleEnum.USER,
    name: '普通用户',
    description: '普通用户，拥有基础权限',
    status: 1,
    sort: 4,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
  },
]

// 模拟菜单列表数据
const menuList = [
  {
    id: 1,
    parentId: 0,
    name: '首页',
    path: '/home',
    component: 'Layout',
    icon: 'ep:home-filled',
    sort: 1,
    status: 1,
    hidden: false,
    keepAlive: true,
    type: 1, // 1-目录 2-菜单 3-按钮
    permissions: ['dashboard:view'],
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    parentId: 0,
    name: '系统管理',
    path: '/system',
    component: 'Layout',
    icon: 'ep:setting',
    sort: 2,
    status: 1,
    hidden: false,
    keepAlive: true,
    type: 1,
    permissions: ['system:view'],
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    id: 3,
    parentId: 2,
    name: '用户管理',
    path: '/system/user',
    component: 'system/user/index',
    icon: 'ep:user',
    sort: 1,
    status: 1,
    hidden: false,
    keepAlive: true,
    type: 2,
    permissions: ['system:user:list', 'system:user:view'],
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    id: 4,
    parentId: 2,
    name: '角色管理',
    path: '/system/role',
    component: 'system/role/index',
    icon: 'ep:user-filled',
    sort: 2,
    status: 1,
    hidden: false,
    keepAlive: true,
    type: 2,
    permissions: ['system:role:list', 'system:role:view'],
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    id: 5,
    parentId: 2,
    name: '菜单管理',
    path: '/system/menu',
    component: 'system/menu/index',
    icon: 'ep:menu',
    sort: 3,
    status: 1,
    hidden: false,
    keepAlive: true,
    type: 2,
    permissions: ['system:menu:list', 'system:menu:view'],
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    id: 6,
    parentId: 2,
    name: '系统设置',
    path: '/system/settings',
    component: 'system/settings/index',
    icon: 'ep:setting',
    sort: 4,
    status: 1,
    hidden: false,
    keepAlive: false,
    type: 2,
    permissions: ['system:settings:view'],
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
]

// 系统设置
let systemSettings = {
  siteTitle: 'Vue3 Admin 企业后台',
  siteSubtitle: '高效、灵活的管理系统模板',
  siteLogo: 'https://dummyimage.com/160x40/409eff/ffffff&text=Vue3+Admin',
  siteFavicon: 'https://dummyimage.com/32x32/409eff/ffffff&text=V',
  seoKeywords: ['Vue3', '后台管理', '企业级', 'Admin Template'],
  seoDescription: 'Vue3 Admin 是基于 Vue3 + TypeScript + Element Plus 的企业级后台管理系统模板。',
  seoAuthor: 'Vue3 Admin 团队',
  copyright: '© 2025 Vue3 Admin. All rights reserved.',
  icpNumber: '粤ICP备12345678号',
  analyticsScript: '<!-- analytics script placeholder -->',
  updatedAt: new Date().toISOString(),
}

export default [
  // ========== 用户管理 ==========
  // 获取用户列表
  {
    url: '/api/system/user/list',
    method: 'get',
    timeout: 300,
    response: ({ query }: any) => {
      const { page = 1, pageSize = 10, username, status } = query

      let list = [...userList]

      // 过滤
      if (username) {
        list = list.filter((item) => item.username.includes(username))
      }
      if (status !== undefined && status !== '') {
        list = list.filter((item) => item.status === Number(status))
      }

      // 分页
      const total = list.length
      const start = (Number(page) - 1) * Number(pageSize)
      const end = start + Number(pageSize)
      list = list.slice(start, end)

      return {
        code: 0,
        message: '获取成功',
        data: {
          list,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
        },
      }
    },
  },

  // 获取用户详情
  {
    url: '/api/system/user/:id',
    method: 'get',
    timeout: 200,
    response: ({ query }: any) => {
      const { id } = query
      const user = userList.find((item) => item.id === Number(id))

      if (!user) {
        return {
          code: -1,
          message: '用户不存在',
          data: null,
        }
      }

      return {
        code: 0,
        message: '获取成功',
        data: user,
      }
    },
  },

  // 创建用户
  {
    url: '/api/system/user',
    method: 'post',
    timeout: 500,
    response: ({ body }: any) => {
      const newUser = {
        id: userList.length + 1,
        ...body,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }

      userList.push(newUser)

      return {
        code: 0,
        message: '创建成功',
        data: newUser,
      }
    },
  },

  // 更新用户
  {
    url: '/api/system/user/:id',
    method: 'put',
    timeout: 500,
    response: ({ query, body }: any) => {
      const { id } = query
      const index = userList.findIndex((item) => item.id === Number(id))

      if (index === -1) {
        return {
          code: -1,
          message: '用户不存在',
          data: null,
        }
      }

      userList[index] = {
        ...userList[index],
        ...body,
        updateTime: new Date().toISOString(),
      }

      return {
        code: 0,
        message: '更新成功',
        data: userList[index],
      }
    },
  },

  // 删除用户
  {
    url: '/api/system/user/:id',
    method: 'delete',
    timeout: 500,
    response: ({ query }: any) => {
      const { id } = query
      const index = userList.findIndex((item) => item.id === Number(id))

      if (index === -1) {
        return {
          code: -1,
          message: '用户不存在',
          data: null,
        }
      }

      userList.splice(index, 1)

      return {
        code: 0,
        message: '删除成功',
        data: null,
      }
    },
  },

  // ========== 角色管理 ==========
  // 获取角色列表
  {
    url: '/api/system/role/list',
    method: 'get',
    timeout: 300,
    response: ({ query }: any) => {
      const { page = 1, pageSize = 10, name, status } = query

      let list = [...roleList]

      // 过滤
      if (name) {
        list = list.filter((item) => item.name.includes(name))
      }
      if (status !== undefined && status !== '') {
        list = list.filter((item) => item.status === Number(status))
      }

      // 分页
      const total = list.length
      const start = (Number(page) - 1) * Number(pageSize)
      const end = start + Number(pageSize)
      list = list.slice(start, end)

      return {
        code: 0,
        message: '获取成功',
        data: {
          list,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
        },
      }
    },
  },

  // 获取所有角色（不分页，用于下拉选择）
  {
    url: '/api/system/role/all',
    method: 'get',
    timeout: 200,
    response: () => {
      return {
        code: 0,
        message: '获取成功',
        data: roleList.filter((item) => item.status === 1),
      }
    },
  },

  // 获取角色详情
  {
    url: '/api/system/role/:id',
    method: 'get',
    timeout: 200,
    response: ({ query }: any) => {
      const { id } = query
      const role = roleList.find((item) => item.id === Number(id))

      if (!role) {
        return {
          code: -1,
          message: '角色不存在',
          data: null,
        }
      }

      return {
        code: 0,
        message: '获取成功',
        data: role,
      }
    },
  },

  // 创建角色
  {
    url: '/api/system/role',
    method: 'post',
    timeout: 500,
    response: ({ body }: any) => {
      const newRole = {
        id: roleList.length + 1,
        ...body,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }

      roleList.push(newRole)

      return {
        code: 0,
        message: '创建成功',
        data: newRole,
      }
    },
  },

  // 更新角色
  {
    url: '/api/system/role/:id',
    method: 'put',
    timeout: 500,
    response: ({ query, body }: any) => {
      const { id } = query
      const index = roleList.findIndex((item) => item.id === Number(id))

      if (index === -1) {
        return {
          code: -1,
          message: '角色不存在',
          data: null,
        }
      }

      roleList[index] = {
        ...roleList[index],
        ...body,
        updateTime: new Date().toISOString(),
      }

      return {
        code: 0,
        message: '更新成功',
        data: roleList[index],
      }
    },
  },

  // 删除角色
  {
    url: '/api/system/role/:id',
    method: 'delete',
    timeout: 500,
    response: ({ query }: any) => {
      const { id } = query
      const index = roleList.findIndex((item) => item.id === Number(id))

      if (index === -1) {
        return {
          code: -1,
          message: '角色不存在',
          data: null,
        }
      }

      roleList.splice(index, 1)

      return {
        code: 0,
        message: '删除成功',
        data: null,
      }
    },
  },

  // ========== 菜单管理 ==========
  // 获取菜单列表（树形结构）
  {
    url: '/api/system/menu/list',
    method: 'get',
    timeout: 300,
    response: () => {
      // 构建树形结构
      const buildTree = (parentId: number): any[] => {
        return menuList
          .filter((item) => item.parentId === parentId)
          .map((item) => ({
            ...item,
            children: buildTree(item.id),
          }))
      }

      const tree = buildTree(0)

      return {
        code: 0,
        message: '获取成功',
        data: tree,
      }
    },
  },

  // 获取菜单详情
  {
    url: '/api/system/menu/:id',
    method: 'get',
    timeout: 200,
    response: ({ query }: any) => {
      const { id } = query
      const menu = menuList.find((item) => item.id === Number(id))

      if (!menu) {
        return {
          code: -1,
          message: '菜单不存在',
          data: null,
        }
      }

      return {
        code: 0,
        message: '获取成功',
        data: menu,
      }
    },
  },

  // 创建菜单
  {
    url: '/api/system/menu',
    method: 'post',
    timeout: 500,
    response: ({ body }: any) => {
      const newMenu = {
        id: menuList.length + 1,
        ...body,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }

      menuList.push(newMenu)

      return {
        code: 0,
        message: '创建成功',
        data: newMenu,
      }
    },
  },

  // 更新菜单
  {
    url: '/api/system/menu/:id',
    method: 'put',
    timeout: 500,
    response: ({ query, body }: any) => {
      const { id } = query
      const index = menuList.findIndex((item) => item.id === Number(id))

      if (index === -1) {
        return {
          code: -1,
          message: '菜单不存在',
          data: null,
        }
      }

      menuList[index] = {
        ...menuList[index],
        ...body,
        updateTime: new Date().toISOString(),
      }

      return {
        code: 0,
        message: '更新成功',
        data: menuList[index],
      }
    },
  },

  // 删除菜单
  {
    url: '/api/system/menu/:id',
    method: 'delete',
    timeout: 500,
    response: ({ query }: any) => {
      const { id } = query
      const index = menuList.findIndex((item) => item.id === Number(id))

      if (index === -1) {
        return {
          code: -1,
          message: '菜单不存在',
          data: null,
        }
      }

      // 检查是否有子菜单
      const hasChildren = menuList.some((item) => item.parentId === Number(id))
      if (hasChildren) {
        return {
          code: -1,
          message: '该菜单存在子菜单，无法删除',
          data: null,
        }
      }

      menuList.splice(index, 1)

      return {
        code: 0,
        message: '删除成功',
        data: null,
      }
    },
  },

  // 获取系统设置
  {
    url: '/api/system/settings',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: systemSettings,
        message: 'success',
      }
    },
  },

  // 更新系统设置
  {
    url: '/api/system/settings',
    method: 'put',
    response: ({ body }: any) => {
      systemSettings = {
        ...systemSettings,
        ...body,
        seoKeywords: Array.isArray(body?.seoKeywords)
          ? body.seoKeywords
          : typeof body?.seoKeywords === 'string'
            ? body.seoKeywords.split(',').map((item: string) => item.trim()).filter(Boolean)
            : systemSettings.seoKeywords,
        updatedAt: new Date().toISOString(),
      }

      return {
        code: 200,
        data: systemSettings,
        message: '系统设置更新成功',
      }
    },
  },
] as MockMethod[]
