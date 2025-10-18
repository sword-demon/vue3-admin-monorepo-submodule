/**
 * 主题配置 Store
 */

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

/** 主题模式类型 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/** 主题配置 */
export interface ThemeConfig {
  /** 主题模式 */
  mode: ThemeMode
  /** 主色调 */
  primaryColor: string
  /** 是否显示灰色模式(哀悼模式) */
  grayMode: boolean
  /** 是否显示色弱模式 */
  colorWeakness: boolean
}

const STORAGE_KEY = 'vue3-admin-theme'

/**
 * 获取系统主题
 */
const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * 从 localStorage 读取主题配置
 */
const loadThemeFromStorage = (): ThemeConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('读取主题配置失败:', error)
  }

  // 默认配置
  return {
    mode: 'light',
    primaryColor: '#409eff',
    grayMode: false,
    colorWeakness: false,
  }
}

/**
 * 保存主题配置到 localStorage
 */
const saveThemeToStorage = (config: ThemeConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.error('保存主题配置失败:', error)
  }
}

/**
 * 应用暗色模式
 */
const applyDarkMode = (isDark: boolean): void => {
  const htmlElement = document.documentElement
  if (isDark) {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }
}

/**
 * 应用主色调
 */
const applyPrimaryColor = (color: string): void => {
  document.documentElement.style.setProperty('--el-color-primary', color)
}

/**
 * 应用灰色模式
 */
const applyGrayMode = (enabled: boolean): void => {
  const htmlElement = document.documentElement
  if (enabled) {
    htmlElement.classList.add('gray-mode')
  } else {
    htmlElement.classList.remove('gray-mode')
  }
}

/**
 * 应用色弱模式
 */
const applyColorWeakness = (enabled: boolean): void => {
  const htmlElement = document.documentElement
  if (enabled) {
    htmlElement.classList.add('color-weakness')
  } else {
    htmlElement.classList.remove('color-weakness')
  }
}

export const useThemeStore = defineStore('theme', () => {
  // ========== 状态 ==========

  /** 主题配置 */
  const config = ref<ThemeConfig>(loadThemeFromStorage())

  /** 实际应用的主题(考虑auto模式) */
  const actualTheme = ref<'light' | 'dark'>('light')

  // ========== Getters ==========

  /** 是否为暗色模式 */
  const isDark = () => actualTheme.value === 'dark'

  // ========== Actions ==========

  /**
   * 计算实际应用的主题
   */
  const computeActualTheme = (): 'light' | 'dark' => {
    if (config.value.mode === 'auto') {
      return getSystemTheme()
    }
    return config.value.mode
  }

  /**
   * 应用所有主题设置
   */
  const applyTheme = (): void => {
    actualTheme.value = computeActualTheme()
    applyDarkMode(actualTheme.value === 'dark')
    applyPrimaryColor(config.value.primaryColor)
    applyGrayMode(config.value.grayMode)
    applyColorWeakness(config.value.colorWeakness)
  }

  /**
   * 设置主题模式
   */
  const setMode = (mode: ThemeMode): void => {
    config.value.mode = mode
    applyTheme()
    saveThemeToStorage(config.value)
  }

  /**
   * 切换暗色模式
   */
  const toggleDark = (): void => {
    const newMode: ThemeMode = actualTheme.value === 'dark' ? 'light' : 'dark'
    setMode(newMode)
  }

  /**
   * 设置主色调
   */
  const setPrimaryColor = (color: string): void => {
    config.value.primaryColor = color
    applyPrimaryColor(color)
    saveThemeToStorage(config.value)
  }

  /**
   * 设置灰色模式
   */
  const setGrayMode = (enabled: boolean): void => {
    config.value.grayMode = enabled
    applyGrayMode(enabled)
    saveThemeToStorage(config.value)
  }

  /**
   * 设置色弱模式
   */
  const setColorWeakness = (enabled: boolean): void => {
    config.value.colorWeakness = enabled
    applyColorWeakness(enabled)
    saveThemeToStorage(config.value)
  }

  /**
   * 重置主题配置
   */
  const resetTheme = (): void => {
    config.value = {
      mode: 'light',
      primaryColor: '#409eff',
      grayMode: false,
      colorWeakness: false,
    }
    applyTheme()
    saveThemeToStorage(config.value)
  }

  /**
   * 初始化主题
   */
  const initTheme = (): void => {
    applyTheme()

    // 监听系统主题变化(仅在auto模式下)
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (config.value.mode === 'auto') {
          applyTheme()
        }
      })
    }
  }

  // 监听配置变化,自动应用
  watch(
    () => config.value,
    () => {
      applyTheme()
    },
    { deep: true }
  )

  return {
    // 状态
    config,
    actualTheme,
    // Getters
    isDark,
    // Actions
    setMode,
    toggleDark,
    setPrimaryColor,
    setGrayMode,
    setColorWeakness,
    resetTheme,
    initTheme,
  }
})
