/**
 * 角色权限映射配置
 * 定义系统中所有角色及其对应的权限
 */

/**
 * 角色枚举
 */
export enum RoleEnum {
  /** 超级管理员 */
  SUPER_ADMIN = 'super_admin',
  /** 管理员 */
  ADMIN = 'admin',
  /** 编辑员 */
  EDITOR = 'editor',
  /** 普通用户 */
  USER = 'user',
}

/**
 * 权限代码定义
 */
export const PermissionCodes = {
  // 系统管理权限
  SYSTEM: {
    USER: {
      LIST: 'system:user:list',
      CREATE: 'system:user:create',
      EDIT: 'system:user:edit',
      DELETE: 'system:user:delete',
      VIEW: 'system:user:view',
    },
    ROLE: {
      LIST: 'system:role:list',
      CREATE: 'system:role:create',
      EDIT: 'system:role:edit',
      DELETE: 'system:role:delete',
      VIEW: 'system:role:view',
    },
    MENU: {
      LIST: 'system:menu:list',
      CREATE: 'system:menu:create',
      EDIT: 'system:menu:edit',
      DELETE: 'system:menu:delete',
      VIEW: 'system:menu:view',
    },
    SETTINGS: {
      VIEW: 'system:settings:view',
      EDIT: 'system:settings:edit',
    },
  },

  // 内容管理权限
  CONTENT: {
    ARTICLE: {
      LIST: 'content:article:list',
      CREATE: 'content:article:create',
      EDIT: 'content:article:edit',
      DELETE: 'content:article:delete',
      VIEW: 'content:article:view',
      PUBLISH: 'content:article:publish',
    },
    CATEGORY: {
      LIST: 'content:category:list',
      CREATE: 'content:category:create',
      EDIT: 'content:category:edit',
      DELETE: 'content:category:delete',
      VIEW: 'content:category:view',
    },
  },

  // 数据分析权限
  ANALYTICS: {
    OVERVIEW: {
      VIEW: 'analytics:overview:view',
    },
    REPORT: {
      VIEW: 'analytics:report:view',
      EXPORT: 'analytics:report:export',
    },
  },
} as const

/**
 * 角色权限映射配置
 */
export const RolePermissionsConfig: Record<RoleEnum, string[]> = {
  // 超级管理员 - 拥有所有权限
  [RoleEnum.SUPER_ADMIN]: ['*:*:*'],

  // 管理员 - 拥有大部分管理权限
  [RoleEnum.ADMIN]: [
    // 系统管理 - 用户管理
    'system:user:list',
    'system:user:create',
    'system:user:edit',
    'system:user:delete',
    'system:user:view',

    // 系统管理 - 角色管理
    'system:role:list',
    'system:role:create',
    'system:role:edit',
    'system:role:delete',
    'system:role:view',

    // 系统管理 - 菜单管理
    'system:menu:list',
    'system:menu:create',
    'system:menu:edit',
    'system:menu:delete',
    'system:menu:view',

    // 系统管理 - 系统设置
    'system:settings:view',
    'system:settings:edit',

    // 内容管理
    'content:article:list',
    'content:article:create',
    'content:article:edit',
    'content:article:delete',
    'content:article:view',
    'content:article:publish',
    'content:category:list',
    'content:category:create',
    'content:category:edit',
    'content:category:delete',
    'content:category:view',

    // 数据分析
    'analytics:overview:view',
    'analytics:report:view',
    'analytics:report:export',
  ],

  // 编辑员 - 主要负责内容编辑
  [RoleEnum.EDITOR]: [
    // 内容管理
    'content:article:list',
    'content:article:create',
    'content:article:edit',
    'content:article:view',
    'content:category:list',
    'content:category:view',

    // 数据分析（只读）
    'analytics:overview:view',
  ],

  // 普通用户 - 基础查看权限
  [RoleEnum.USER]: [
    // 内容查看
    'content:article:list',
    'content:article:view',
    'content:category:list',
    'content:category:view',
  ],
}

/**
 * 角色描述配置
 */
export const RoleDescriptions: Record<RoleEnum, string> = {
  [RoleEnum.SUPER_ADMIN]: '超级管理员，拥有系统所有权限',
  [RoleEnum.ADMIN]: '管理员，拥有系统管理和内容管理权限',
  [RoleEnum.EDITOR]: '编辑员，主要负责内容的编辑和管理',
  [RoleEnum.USER]: '普通用户，拥有基础的查看权限',
}

/**
 * 获取角色的权限列表
 * @param role 角色
 * @returns 权限列表
 */
export const getRolePermissions = (role: RoleEnum): string[] => {
  return RolePermissionsConfig[role] || []
}

/**
 * 获取多个角色的合并权限列表
 * @param roles 角色列表
 * @returns 权限列表（去重）
 */
export const getMultiRolePermissions = (roles: RoleEnum[]): string[] => {
  const permissions = roles.flatMap((role) => getRolePermissions(role))
  return Array.from(new Set(permissions))
}

/**
 * 检查角色是否有某个权限
 * @param role 角色
 * @param permission 权限代码
 * @returns 是否有权限
 */
export const roleHasPermission = (role: RoleEnum, permission: string): boolean => {
  const permissions = getRolePermissions(role)

  // 超级管理员拥有所有权限
  if (permissions.includes('*:*:*')) {
    return true
  }

  return permissions.includes(permission)
}

/**
 * 检查多个角色是否有某个权限（任意一个角色有权限即可）
 * @param roles 角色列表
 * @param permission 权限代码
 * @returns 是否有权限
 */
export const multiRolesHasPermission = (roles: RoleEnum[], permission: string): boolean => {
  return roles.some((role) => roleHasPermission(role, permission))
}
