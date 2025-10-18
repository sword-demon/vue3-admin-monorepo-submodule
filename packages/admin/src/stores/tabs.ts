/**
 * 标签页管理 Store
 */

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'

/** 标签项 */
export interface TabItem {
  /** 路径 */
  path: string
  /** 标题 */
  title: string
  /** 图标 */
  icon?: string
  /** 是否固定(不可关闭) */
  affix?: boolean
  /** 完整路由信息(用于恢复状态) */
  fullPath?: string
  /** 查询参数 */
  query?: Record<string, unknown>
}

const STORAGE_KEY = 'vue3-admin-tabs'

/**
 * 从 localStorage 读取标签列表
 */
const loadTabsFromStorage = (): TabItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('读取标签页配置失败:', error)
  }
  return []
}

/**
 * 保存标签列表到 localStorage
 */
const saveTabsToStorage = (tabs: TabItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs))
  } catch (error) {
    console.error('保存标签页配置失败:', error)
  }
}

/**
 * 从路由创建标签项
 */
const createTabFromRoute = (route: RouteLocationNormalizedLoaded): TabItem => {
  return {
    path: route.path,
    title: (route.meta?.title as string) || '未命名',
    icon: route.meta?.icon as string | undefined,
    affix: route.meta?.affix as boolean | undefined,
    fullPath: route.fullPath,
    query: route.query as Record<string, unknown>,
  }
}

export const useTabsStore = defineStore('tabs', () => {
  // ========== 状态 ==========

  /** 标签列表 */
  const tabs = ref<TabItem[]>(loadTabsFromStorage())

  /** 当前激活的标签路径 */
  const activeTabPath = ref<string>('')

  // ========== Actions ==========

  /**
   * 添加标签
   */
  const addTab = (route: RouteLocationNormalizedLoaded): void => {
    // 忽略没有 title 的路由
    if (!route.meta?.title) {
      return
    }

    const newTab = createTabFromRoute(route)

    // 检查是否已存在
    const existIndex = tabs.value.findIndex((tab) => tab.path === newTab.path)

    if (existIndex !== -1) {
      // 已存在,更新信息
      tabs.value[existIndex] = newTab
    } else {
      // 不存在,添加到列表
      tabs.value.push(newTab)
    }

    // 设置为激活标签
    activeTabPath.value = newTab.path
  }

  /**
   * 移除标签
   */
  const removeTab = (path: string): string | null => {
    const index = tabs.value.findIndex((tab) => tab.path === path)

    if (index === -1) {
      return null
    }

    // 不允许关闭固定标签
    if (tabs.value[index].affix) {
      return null
    }

    // 移除标签
    tabs.value.splice(index, 1)

    // 如果关闭的是当前激活标签,需要切换到其他标签
    if (activeTabPath.value === path) {
      if (tabs.value.length > 0) {
        // 优先切换到右侧标签,否则切换到左侧
        const nextTab = tabs.value[index] || tabs.value[index - 1]
        return nextTab.path
      }
    }

    return null
  }

  /**
   * 关闭其他标签
   */
  const closeOtherTabs = (path: string): void => {
    tabs.value = tabs.value.filter((tab) => tab.affix || tab.path === path)
  }

  /**
   * 关闭左侧标签
   */
  const closeLeftTabs = (path: string): void => {
    const index = tabs.value.findIndex((tab) => tab.path === path)
    if (index === -1) return

    tabs.value = tabs.value.filter((tab, i) => {
      return i >= index || tab.affix
    })
  }

  /**
   * 关闭右侧标签
   */
  const closeRightTabs = (path: string): void => {
    const index = tabs.value.findIndex((tab) => tab.path === path)
    if (index === -1) return

    tabs.value = tabs.value.filter((tab, i) => {
      return i <= index || tab.affix
    })
  }

  /**
   * 关闭所有标签
   */
  const closeAllTabs = (): void => {
    tabs.value = tabs.value.filter((tab) => tab.affix)
  }

  /**
   * 刷新标签
   */
  const refreshTab = (path: string): void => {
    // 触发路由重新加载的逻辑由外部处理
    console.log('刷新标签:', path)
  }

  /**
   * 设置激活标签
   */
  const setActiveTab = (path: string): void => {
    activeTabPath.value = path
  }

  /**
   * 查找标签
   */
  const findTab = (path: string): TabItem | undefined => {
    return tabs.value.find((tab) => tab.path === path)
  }

  /**
   * 初始化固定标签
   */
  const initAffixTabs = (routes: RouteRecordRaw[]): void => {
    const affixTabs: TabItem[] = []

    const findAffixTabs = (targetRoutes: RouteRecordRaw[], basePath = ''): void => {
      targetRoutes.forEach((route) => {
        if (route.meta?.affix && route.meta?.title) {
          const joinedPath = route.path.startsWith('/')
            ? route.path
            : `${basePath}/${route.path}`
          const normalizedPath = joinedPath.replace(/\/{2,}/g, '/')
          const fullPath = normalizedPath.replace(/\/+$/, '') || '/'
          affixTabs.push({
            path: fullPath,
            title: route.meta.title as string,
            icon: route.meta.icon as string | undefined,
            affix: true,
            fullPath: fullPath,
          })
        }

        if (route.children) {
          const childJoinedPath = route.path.startsWith('/') ? route.path : `${basePath}/${route.path}`
          const childBasePath = childJoinedPath.replace(/\/{2,}/g, '/')
          findAffixTabs(route.children, childBasePath)
        }
      })
    }

    findAffixTabs(routes)

    // 添加固定标签到列表(如果不存在)
    affixTabs.forEach((affixTab) => {
      if (!tabs.value.find((tab) => tab.path === affixTab.path)) {
        tabs.value.unshift(affixTab)
      }
    })
  }

  /**
   * 清空标签(登出时使用)
   */
  const clearTabs = (): void => {
    tabs.value = []
    activeTabPath.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  // 监听标签变化,自动持久化
  watch(
    () => tabs.value,
    (newTabs) => {
      saveTabsToStorage(newTabs)
    },
    { deep: true }
  )

  return {
    // 状态
    tabs,
    activeTabPath,
    // Actions
    addTab,
    removeTab,
    closeOtherTabs,
    closeLeftTabs,
    closeRightTabs,
    closeAllTabs,
    refreshTab,
    setActiveTab,
    findTab,
    initAffixTabs,
    clearTabs,
  }
})
