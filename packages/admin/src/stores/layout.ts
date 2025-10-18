/**
 * 布局状态管理 Store
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

/** 布局模式 */
export type LayoutMode = 'classic' | 'top'

/** 设备类型 */
export type DeviceType = 'desktop' | 'tablet' | 'mobile'

export const useLayoutStore = defineStore('layout', () => {
  // 状态
  const layoutMode = ref<LayoutMode>('classic') // 布局模式
  const sidebarCollapsed = ref(false) // 侧边栏是否折叠
  const deviceType = ref<DeviceType>('desktop') // 设备类型
  const showMobileSidebar = ref(false) // 移动端是否显示侧边栏

  /**
   * 切换侧边栏折叠状态
   */
  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /**
   * 设置侧边栏折叠状态
   */
  const setSidebarCollapsed = (collapsed: boolean): void => {
    sidebarCollapsed.value = collapsed
  }

  /**
   * 切换布局模式
   */
  const setLayoutMode = (mode: LayoutMode): void => {
    layoutMode.value = mode
    // 切换到顶部布局时,取消侧边栏折叠
    if (mode === 'top') {
      sidebarCollapsed.value = false
    }
  }

  /**
   * 设置设备类型
   */
  const setDeviceType = (device: DeviceType): void => {
    deviceType.value = device

    // 移动端自动折叠侧边栏
    if (device === 'mobile') {
      sidebarCollapsed.value = true
      showMobileSidebar.value = false
    }
  }

  /**
   * 切换移动端侧边栏显示
   */
  const toggleMobileSidebar = (): void => {
    showMobileSidebar.value = !showMobileSidebar.value
  }

  /**
   * 关闭移动端侧边栏
   */
  const closeMobileSidebar = (): void => {
    showMobileSidebar.value = false
  }

  /**
   * 检测设备类型
   */
  const detectDevice = (): void => {
    const width = window.innerWidth
    if (width < 768) {
      setDeviceType('mobile')
    } else if (width < 1024) {
      setDeviceType('tablet')
    } else {
      setDeviceType('desktop')
    }
  }

  // 初始化时检测设备类型
  if (typeof window !== 'undefined') {
    detectDevice()

    // 监听窗口大小变化
    window.addEventListener('resize', detectDevice)
  }

  return {
    // 状态
    layoutMode,
    sidebarCollapsed,
    deviceType,
    showMobileSidebar,

    // 方法
    toggleSidebar,
    setSidebarCollapsed,
    setLayoutMode,
    setDeviceType,
    toggleMobileSidebar,
    closeMobileSidebar,
    detectDevice,
  }
})
