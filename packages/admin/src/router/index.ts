import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'
import { ClassicLayout } from '@/layouts'
import { asyncRoutes, notFoundRoute } from './asyncRoutes'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'

/**
 * 静态路由(无需权限的基础路由)
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/redirect',
    component: ClassicLayout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue'),
        meta: {
          hidden: true,
        },
      },
    ],
  },
  {
    path: '/',
    component: ClassicLayout,
    redirect: '/home',
    meta: {
      title: '工作台',
      icon: 'i-ep-menu',
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'i-ep-home-filled',
          affix: true,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes: constantRoutes,
})

// 白名单路由(无需认证)
const WHITE_LIST = ['/login']

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || import.meta.env.VITE_APP_TITLE

  // 检查是否需要认证
  if (WHITE_LIST.includes(to.path)) {
    // 白名单路由,直接放行
    next()
    return
  }

  // 检查用户是否已登录
  if (!isAuthenticated()) {
    // 未登录,重定向到登录页
    next({
      path: '/login',
      query: {
        redirect: to.fullPath, // 保存目标路由,登录后跳转
      },
    })
    return
  }

  // 已登录,检查是否已生成动态路由
  const permissionStore = usePermissionStore()
  const userStore = useUserStore()

  // 如果还没有用户信息,先获取用户信息
  if (!userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      // 获取用户信息失败,跳转到登录页
      await userStore.logout()
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
      return
    }
  }

  // 如果还没有生成路由,则生成动态路由
  if (!permissionStore.isRoutesGenerated) {
    try {
      // 根据用户权限生成可访问的路由
      const accessRoutes = await permissionStore.generateRoutes(asyncRoutes)

      // 动态添加路由
      accessRoutes.forEach((route) => {
        router.addRoute(route)
      })

      // 添加404路由(必须在最后)
      router.addRoute(notFoundRoute)

      // 设置所有路由(静态+动态)
      permissionStore.setRoutes([...constantRoutes, ...accessRoutes])

      // 重新导航到目标路由
      next({ ...to, replace: true })
      return
    } catch (error) {
      console.error('生成路由失败:', error)
      // 生成路由失败,跳转到登录页
      await userStore.logout()
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
      return
    }
  }

  // 额外的权限检查：确保用户有权限访问目标路由
  // 这是一个额外的安全层，防止用户通过直接修改URL访问无权限的页面
  if (to.meta.permissions || to.meta.roles) {
    const hasPermission = permissionStore.canAccessRoute({ meta: to.meta })

    if (!hasPermission) {
      console.warn(`用户无权限访问: ${to.path}`)

      // 无权限，重定向到首页
      next({
        path: '/',
        replace: true,
      })
      return
    }
  }

  // 放行
  next()
})

export default router
