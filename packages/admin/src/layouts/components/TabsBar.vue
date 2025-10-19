<template>
  <div class="tabs-bar">
    <el-tabs
      v-model="activeTabPath"
      type="card"
      class="tabs-content"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="tab in tabsStore.tabs"
        :key="tab.path"
        :label="tab.title"
        :name="tab.path"
        :closable="!tab.affix"
      >
        <template #label>
          <div class="tab-label" @contextmenu.prevent="handleContextMenu($event, tab)">
            <el-icon v-if="tab.icon" class="tab-icon">
              <component :is="tab.icon" />
            </el-icon>
            <span class="tab-title">{{ tab.title }}</span>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 右键菜单 -->
    <div
      v-show="contextMenuVisible"
      :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
      class="context-menu"
      @click="contextMenuVisible = false"
    >
      <div class="context-menu-item" @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        <span>刷新</span>
      </div>
      <div v-if="!currentContextTab?.affix" class="context-menu-item" @click="handleClose">
        <el-icon><Close /></el-icon>
        <span>关闭</span>
      </div>
      <div class="context-menu-item" @click="handleCloseOther">
        <el-icon><CircleClose /></el-icon>
        <span>关闭其他</span>
      </div>
      <el-divider style="margin: 4px 0" />
      <div class="context-menu-item" @click="handleCloseLeft">
        <el-icon><Back /></el-icon>
        <span>关闭左侧</span>
      </div>
      <div class="context-menu-item" @click="handleCloseRight">
        <el-icon><Right /></el-icon>
        <span>关闭右侧</span>
      </div>
      <div class="context-menu-item" @click="handleCloseAll">
        <el-icon><CircleClose /></el-icon>
        <span>关闭全部</span>
      </div>
    </div>

    <!-- 遮罩层(点击关闭菜单) -->
    <div
      v-show="contextMenuVisible"
      class="context-menu-mask"
      @click="contextMenuVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Refresh, Close, CircleClose, Back, Right } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
import { useTabsStore } from '@/stores'
import type { TabItem } from '@/stores/tabs'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()

// 激活的标签路径
const activeTabPath = computed({
  get: () => tabsStore.activeTabPath,
  set: (value: string) => {
    tabsStore.setActiveTab(value)
  },
})

// 右键菜单
const contextMenuVisible = ref(false)
const contextMenuPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const currentContextTab = ref<TabItem | null>(null)

/**
 * 标签点击
 */
const handleTabClick = (tab: TabsPaneContext) => {
  const path = String(tab.paneName)
  router.push(path)
}

/**
 * 标签移除
 */
const handleTabRemove = (path: string) => {
  const targetPath = tabsStore.removeTab(path)
  if (targetPath) {
    router.push(targetPath)
  }
}

/**
 * 右键菜单
 */
const handleContextMenu = (event: MouseEvent, tab: TabItem) => {
  event.preventDefault()
  currentContextTab.value = tab
  contextMenuPosition.value = {
    x: event.clientX,
    y: event.clientY,
  }
  contextMenuVisible.value = true
}

/**
 * 刷新当前标签
 */
const handleRefresh = () => {
  if (!currentContextTab.value) return

  // 使用 replace 强制刷新
  const { path } = currentContextTab.value
  router.replace({
    path: '/redirect' + path,
  })
}

/**
 * 关闭当前标签
 */
const handleClose = () => {
  if (!currentContextTab.value || currentContextTab.value.affix) return

  const targetPath = tabsStore.removeTab(currentContextTab.value.path)
  if (targetPath) {
    router.push(targetPath)
  }
}

/**
 * 关闭其他标签
 */
const handleCloseOther = () => {
  if (!currentContextTab.value) return

  tabsStore.closeOtherTabs(currentContextTab.value.path)
  router.push(currentContextTab.value.path)
}

/**
 * 关闭左侧标签
 */
const handleCloseLeft = () => {
  if (!currentContextTab.value) return

  tabsStore.closeLeftTabs(currentContextTab.value.path)
}

/**
 * 关闭右侧标签
 */
const handleCloseRight = () => {
  if (!currentContextTab.value) return

  tabsStore.closeRightTabs(currentContextTab.value.path)
}

/**
 * 关闭全部标签
 */
const handleCloseAll = () => {
  tabsStore.closeAllTabs()
  // 跳转到首页或第一个固定标签
  const firstTab = tabsStore.tabs[0]
  if (firstTab) {
    router.push(firstTab.path)
  }
}

/**
 * 监听路由变化,添加标签
 */
watch(
  () => route.path,
  () => {
    tabsStore.addTab(route)
  },
  { immediate: true }
)

/**
 * 点击外部关闭右键菜单
 */
const handleClickOutside = () => {
  contextMenuVisible.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.tabs-bar {
  position: relative;
  height: var(--app-tabs-height);
  padding: 0 var(--app-padding-base);
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.tabs-content {
  height: 100%;

  :deep(.el-tabs__header) {
    margin: 0;
    border: none;
  }

  :deep(.el-tabs__nav) {
    border: none;
  }

  :deep(.el-tabs__item) {
    height: 32px;
    padding: 0 12px;
    border: 1px solid var(--el-border-color-light);
    color: var(--el-text-color-regular);
    line-height: 32px;
    border-radius: var(--app-border-radius-base) var(--app-border-radius-base) 0 0;
    margin-right: 4px;
    transition: all var(--app-transition-fast);

    &:hover {
      background: var(--app-hover-bg);
      color: var(--el-color-primary);
    }

    &.is-active {
      background: var(--el-bg-color);
      color: var(--el-color-primary);
      border-bottom-color: var(--el-bg-color);
      font-weight: 500;
    }
  }

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tab-icon {
  font-size: 14px;
}

.tab-title {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 右键菜单
.context-menu {
  position: fixed;
  z-index: var(--app-z-index-modal);
  padding: 4px 0;
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color-overlay);
  min-width: 140px;
  border-radius: var(--app-border-radius-base);
  box-shadow: var(--el-box-shadow);
}

.context-menu-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: var(--el-text-color-regular);
  font-size: var(--el-font-size-base);
  gap: 8px;
  cursor: pointer;
  transition: all var(--app-transition-fast);

  &:hover {
    background: var(--app-hover-bg);
    color: var(--el-color-primary);
  }

  .el-icon {
    font-size: 16px;
  }
}

.context-menu-mask {
  position: fixed;
  inset: 0;
  z-index: calc(var(--app-z-index-modal) - 1);
}

// 暗黑模式
html.dark {
  .tabs-bar {
    border-bottom-color: var(--el-border-color);
  }
}
</style>
