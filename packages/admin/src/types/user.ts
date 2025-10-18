/**
 * 用户相关类型定义
 */

/** 用户信息 */
export interface UserInfo {
  /** 用户ID */
  id: string | number
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname?: string
  /** 头像 */
  avatar?: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 角色列表 */
  roles?: string[]
  /** 权限列表 */
  permissions?: string[]
}

/** 登录参数 */
export interface LoginParams {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 验证码 */
  captcha?: string
  /** 验证码标识 */
  captchaId?: string
  /** 记住我 */
  rememberMe?: boolean
}

/** 登录响应 */
export interface LoginResult {
  /** Token */
  token: string
  /** 刷新 Token */
  refreshToken?: string
  /** Token 过期时间（时间戳） */
  expire?: number
  /** 用户信息 */
  userInfo?: UserInfo
}
