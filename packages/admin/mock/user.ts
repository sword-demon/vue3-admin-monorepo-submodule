/**
 * 用户相关 Mock 接口
 * 最后更新: 2025-10-18 - 更新权限配置
 */

import type { MockMethod } from 'vite-plugin-mock'
import { RoleEnum, RolePermissionsConfig } from '../src/config/rolePermissions'

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'super_admin',
    password: 'super_admin123',
    realName: '超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [RoleEnum.SUPER_ADMIN],
    permissions: RolePermissionsConfig[RoleEnum.SUPER_ADMIN],
  },
  {
    id: 2,
    username: 'admin',
    password: 'admin123',
    realName: '管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [RoleEnum.ADMIN],
    permissions: RolePermissionsConfig[RoleEnum.ADMIN],
  },
  {
    id: 3,
    username: 'editor',
    password: 'editor123',
    realName: '编辑员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [RoleEnum.EDITOR],
    permissions: RolePermissionsConfig[RoleEnum.EDITOR],
  },
  {
    id: 4,
    username: 'user',
    password: 'user123',
    realName: '普通用户',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: [RoleEnum.USER],
    permissions: RolePermissionsConfig[RoleEnum.USER],
  },
]

// 生成 Token
const createToken = (username: string): string => {
  return `mock_token_${username}_${Date.now()}`
}

export default [
  // 登录接口
  {
    url: '/api/auth/login',
    method: 'post',
    timeout: 500,
    response: ({ body }: any) => {
      const { username, password } = body

      // 查找用户
      const user = users.find((u) => u.username === username)

      if (!user) {
        return {
          code: -1,
          message: '用户名不存在',
          data: null,
        }
      }

      if (user.password !== password) {
        return {
          code: -1,
          message: '密码错误',
          data: null,
        }
      }

      // 生成 Token
      const token = createToken(username)

      return {
        code: 0,
        message: '登录成功',
        data: {
          token,
          refreshToken: `refresh_${token}`,
          expire: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天
          userInfo: {
            id: user.id,
            username: user.username,
            realName: user.realName,
            avatar: user.avatar,
            roles: user.roles,
            permissions: user.permissions,
          },
        },
      }
    },
  },

  // 获取用户信息接口
  {
    url: '/api/auth/user-info',
    method: 'get',
    timeout: 300,
    response: ({ headers }: any) => {
      const token = headers.authorization?.replace('Bearer ', '')

      if (!token) {
        return {
          code: 401,
          message: '未授权',
          data: null,
        }
      }

      // 从 token 中提取用户名
      const username = token.split('_')[2]
      const user = users.find((u) => u.username === username)

      if (!user) {
        return {
          code: 401,
          message: '用户不存在',
          data: null,
        }
      }

      return {
        code: 0,
        message: '获取成功',
        data: {
          id: user.id,
          username: user.username,
          realName: user.realName,
          avatar: user.avatar,
          roles: user.roles,
          permissions: user.permissions,
        },
      }
    },
  },

  // 登出接口
  {
    url: '/api/auth/logout',
    method: 'post',
    timeout: 200,
    response: () => {
      return {
        code: 0,
        message: '登出成功',
        data: null,
      }
    },
  },

  // 刷新 Token 接口
  {
    url: '/api/auth/refresh-token',
    method: 'post',
    timeout: 300,
    response: ({ body }: any) => {
      const { refreshToken } = body

      if (!refreshToken || !refreshToken.startsWith('refresh_')) {
        return {
          code: -1,
          message: 'Refresh Token 无效',
          data: null,
        }
      }

      // 从 refreshToken 提取原始 token
      const originalToken = refreshToken.replace('refresh_', '')
      const username = originalToken.split('_')[2]
      const user = users.find((u) => u.username === username)

      if (!user) {
        return {
          code: -1,
          message: '用户不存在',
          data: null,
        }
      }

      // 生成新 Token
      const newToken = createToken(username)

      return {
        code: 0,
        message: '刷新成功',
        data: {
          token: newToken,
          refreshToken: `refresh_${newToken}`,
          expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        },
      }
    },
  },
] as MockMethod[]
