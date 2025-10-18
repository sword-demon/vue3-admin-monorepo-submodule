import { createApp, type Directive } from 'vue'
import App from './App.vue'
import router, { constantRoutes } from './router'
import { createPinia } from 'pinia'
import { isAuthenticated } from '@/utils/auth'
import { asyncRoutes, notFoundRoute } from '@/router/asyncRoutes'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'

// 导入 Element Plus 中文语言包
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 导入 Element Plus 消息组件样式(函数式调用需要手动导入)
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'

// 导入全局样式
import './assets/styles/index.scss'

// 导入 UnoCSS
import 'virtual:uno.css'

// 导入自定义指令
import * as directives from './directives'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const bootstrap = async () => {
  const permissionStore = usePermissionStore(pinia)
  const userStore = useUserStore(pinia)

  if (isAuthenticated()) {
    if (!userStore.userInfo) {
      try {
        await userStore.fetchUserInfo()
      } catch (error) {
        console.warn('获取用户信息失败，将在路由守卫中处理:', error)
      }
    }

    if (!permissionStore.isRoutesGenerated) {
      try {
        const accessRoutes = await permissionStore.generateRoutes(asyncRoutes)
        accessRoutes.forEach((route) => {
          const routeName = route.name as string | undefined
          if (!routeName || !router.hasRoute(routeName)) {
            router.addRoute(route)
          }
        })
        if (!router.hasRoute(notFoundRoute.name || 'NotFound')) {
          router.addRoute(notFoundRoute)
        }
        permissionStore.setRoutes([...constantRoutes, ...accessRoutes])
      } catch (error) {
        console.warn('预注入动态路由失败，将在路由守卫中回退处理:', error)
      }
    }
  }
}

bootstrap().finally(() => {
  app.use(router)
  app.use(ElementPlus, {
    locale: zhCn,
  })

  // 注册全局指令
  Object.keys(directives).forEach((key) => {
    const directive = (directives as Record<string, Directive | undefined>)[key]
    if (directive) {
      app.directive(key, directive)
    }
  })

  app.mount('#app')
})
