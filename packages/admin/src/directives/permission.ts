/**
 * 权限指令
 * 用法:
 * - v-permission="'user:create'" - 检查单个权限
 * - v-permission="['user:create', 'user:edit']" - 检查多个权限(任意一个满足即可)
 * - v-permission:all="['user:create', 'user:edit']" - 检查多个权限(全部满足)
 */

import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'

/**
 * 检查是否有权限
 */
const checkPermission = (
  value: string | string[],
  modifiers: DirectiveBinding['modifiers']
): boolean => {
  const userStore = useUserStore()

  if (!value) {
    return false
  }

  // 转换为数组
  const permissions = Array.isArray(value) ? value : [value]

  // 检查模式: all(全部满足) 或 默认(任意一个满足)
  if (modifiers.all) {
    // 全部满足
    return permissions.every((permission) => userStore.hasPermission(permission))
  } else {
    // 任意一个满足
    return permissions.some((permission) => userStore.hasPermission(permission))
  }
}

/**
 * 权限指令
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, modifiers } = binding

    if (!checkPermission(value, modifiers)) {
      // 没有权限,移除元素
      el.parentNode?.removeChild(el)
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const { value, modifiers } = binding

    if (!checkPermission(value, modifiers)) {
      // 没有权限,移除元素
      el.parentNode?.removeChild(el)
    }
  },
}

/**
 * 检查是否有角色
 */
const checkRole = (
  value: string | string[],
  modifiers: DirectiveBinding['modifiers']
): boolean => {
  const userStore = useUserStore()

  if (!value) {
    return false
  }

  // 转换为数组
  const roles = Array.isArray(value) ? value : [value]

  // 检查模式: all(全部满足) 或 默认(任意一个满足)
  if (modifiers.all) {
    // 全部满足
    return roles.every((role) => userStore.hasRole(role))
  } else {
    // 任意一个满足
    return roles.some((role) => userStore.hasRole(role))
  }
}

/**
 * 角色指令
 * 用法:
 * - v-role="'admin'" - 检查单个角色
 * - v-role="['admin', 'manager']" - 检查多个角色(任意一个满足即可)
 * - v-role:all="['admin', 'manager']" - 检查多个角色(全部满足)
 */
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, modifiers } = binding

    if (!checkRole(value, modifiers)) {
      // 没有角色,移除元素
      el.parentNode?.removeChild(el)
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const { value, modifiers } = binding

    if (!checkRole(value, modifiers)) {
      // 没有角色,移除元素
      el.parentNode?.removeChild(el)
    }
  },
}
