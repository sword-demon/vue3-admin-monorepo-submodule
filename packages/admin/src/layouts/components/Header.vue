<template>
  <div class="layout-header">
    <div class="header-left">
      <!-- 折叠按钮 -->
      <div
        v-if="layoutStore.layoutMode === 'classic'"
        class="header-trigger"
        @click="layoutStore.toggleSidebar()"
      >
        <el-icon :size="20">
          <Fold v-if="!layoutStore.sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
      </div>

      <!-- Logo (顶部布局时显示) -->
      <div v-if="layoutStore.layoutMode === 'top'" class="header-logo">
        <img
          v-if="settingsStore.siteLogo"
          :src="settingsStore.siteLogo"
          alt="站点 Logo"
          class="logo-image"
        />
        <SvgIcon
          v-else
          icon="carbon:application"
          :size="28"
          color="var(--el-color-primary)"
        />
        <span class="logo-text">{{ settingsStore.siteTitle }}

</span>
      </div>

      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="header-breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header-right">
      <!-- 搜索 -->
      <div class="header-action">
        <el-tooltip content="搜索" placement="bottom">
          <el-icon :size="18">
            <Search />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 主题切换 -->
      <div class="header-action" @click="themeStore.toggleDark()">
        <el-tooltip :content="themeStore.isDark() ? '切换到亮色模式' : '切换到暗色模式'" placement="bottom">
          <el-icon :size="18">
            <Sunny v-if="themeStore.isDark()" />
            <Moon v-else />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 全屏 -->
      <div class="header-action" @click="toggleFullscreen">
        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <el-icon :size="18">
            <FullScreen />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 通知 -->
      <el-badge :value="3" class="header-action">
        <el-tooltip content="通知" placement="bottom">
          <el-icon :size="18">
            <Bell />
          </el-icon>
        </el-tooltip>
      </el-badge>

      <!-- 用户信息 -->
      <el-dropdown class="header-user" @command="handleUserCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="userStore.userInfo?.avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <span class="user-name">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}

</span>
          <el-icon class="user-arrow"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted }

 from 'vue'
import { useRouter, useRoute }

 from 'vue-router'
import { ElMessageBox, ElMessage }

 from 'element-plus'
import {
  Fold,
  Expand,
  Search,
  Sunny,
  Moon,
  FullScreen,
  Bell,
  User,
  ArrowDown,
  Setting,
  SwitchButton,
}

 from '@element-plus/icons-vue'
import { SvgIcon }

 from '@/components/common'
import { useLayoutStore, useUserStore, useThemeStore, useSettingsStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()
const userStore = useUserStore()
const themeStore = useThemeStore()
const settingsStore = useSettingsStore()

// 全屏状态
const isFullscreen = ref(false)

// 面包屑
const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  return matched.map((item) => ({
    path: item.path,
    title: item.meta.title as string,
  }))
})

/**
 * 切换全屏
 */
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  }

 else {
    document.exitFullscreen()
  }
}

/**
 * 监听全屏状态变化
 * 确保全屏切换后页面布局正确响应
 */
const handlefullscreenchange = () => {
  isFullscreen.value = !!document.fullscreenElement

  // 延迟触发 resize 事件，确保布局正确更新
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 100)
}

// 组件挂载时添加全屏状态监听
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange) // Safari 兼容
  document.addEventListener('mozfullscreenchange', handleFullscreenChange) // Firefox 兼容
  settingsStore.fetchSettings().catch((error) => {
    console.warn('[Header] fetchSettings failed:', error)
  })
})

// 组件卸载时移除监听器
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
})

/**
 * 用户下拉菜单命令
 */
const handleUserCommand = async (command: string) => {
  console.log('[Header] handleUserCommand called with:', command)

  switch (command) {
    case 'profile':
      console.log('[Header] profile clicked')
      router.push('/profile')
      break
    case 'settings':
      console.log('[Header] settings clicked')
      router.push('/system/settings')
      break
    case 'logout':
      console.log('[Header] logout clicked')
      try {
        await ElMessageBox.confirm('确定要退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })

        await userStore.logout()
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch (error) {
        console.log('[Header] logout cancelled')
      }

      break
    default:
      console.warn('[Header] Unknown command:', command)default
  }
}

</script>

<style scoped lang="scss">
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--app-header-height);
  padding: 0 var(--app-padding-base);
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--app-margin-base);
  flex: 1;
  min-width: 0;
}

.header-trigger {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: var(--app-border-radius-base);
  transition: all var(--app-transition-fast);

  &:hover {
    background: var(--el-fill-color);
  }
}

.header-logo {
  display: flex;
  align-items: center;
  color: var(--el-text-color-primary);
  font-size: var(--el-font-size-large);
  gap: var(--app-margin-small);
  font-weight: 600;

  .logo-image {
    display: block;
    height: 28px;
    object-fit: contain;
  }

  .logo-text {
    white-space: nowrap;
  }
}

.header-breadcrumb {
  flex: 1;
  min-width: 0;

  :deep(.el-breadcrumb__inner) {
    color: var(--el-text-color-regular);
    font-weight: normal;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: var(--el-text-color-primary);
    font-weight: 500;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--app-margin-base);
}

.header-action {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  border-radius: var(--app-border-radius-base);
  transition: all var(--app-transition-fast);

  &:hover {
    background: var(--el-fill-color);
    color: var(--el-text-color-primary);
  }
}

.header-user {
  cursor: pointer;

  .user-info {
    display: flex;
    align-items: center;
    gap: var(--app-margin-small);
    padding: 4px 8px;
    border-radius: var(--app-border-radius-base);
    transition: all var(--app-transition-fast);

    &:hover {
      background: var(--el-fill-color);
    }
  }

  .user-name {
    color: var(--el-text-color-primary);
    font-size: var(--el-font-size-base);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-arrow {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}

// 响应式
@media (max-width: 768px) {
  .header-breadcrumb {
    display: none;
  }

  .user-name {
    display: none;
  }
}
</style>
