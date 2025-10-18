import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 菜单图标 */
    icon?: string
    /** 是否隐藏菜单 */
    hidden?: boolean
    /** 是否固定标签页 */
    affix?: boolean
    /** 是否缓存页面 */
    keepAlive?: boolean
    /** 权限标识 */
    permissions?: string[]
  }
}

export {}
