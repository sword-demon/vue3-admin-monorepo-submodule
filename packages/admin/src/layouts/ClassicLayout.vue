<template>
  <div class="layout-classic">
    <!-- 侧边栏 -->
    <Sidebar />

    <!-- 主容器 -->
    <div
      class="layout-main"
      :class="{
        'is-collapsed': layoutStore.sidebarCollapsed,
      }"
    >
      <!-- 顶部栏 -->
      <Header />

      <!-- 标签页 -->
      <TabsBar />

      <!-- 内容区 -->
      <div class="layout-content">
        <el-scrollbar class="content-scrollbar">
          <div class="content-wrapper">
            <router-view v-slot="{ Component, route }">
              <transition name="fade-transform" mode="out-in">
                <keep-alive v-if="route.meta.keepAlive">
                  <component :is="Component" :key="route.path" />
                </keep-alive>
                <component :is="Component" v-else :key="route.path" />
              </transition>
            </router-view>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore }

 from '@/stores'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import TabsBar from './components/TabsBar.vue'

const layoutStore = useLayoutStore()
</script>

<style scoped lang="scss">
.layout-classic {
  display: flex;
  width: 100%;
  height: 100vh;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: calc(100% - var(--app-sidebar-width));
  margin-left: var(--app-sidebar-width);
  transition: all var(--app-transition-base);

  &.is-collapsed {
    width: calc(100% - var(--app-sidebar-collapsed-width));
    margin-left: var(--app-sidebar-collapsed-width);
  }
}

.layout-content {
  flex: 1;
  width: 100%;
  height: calc(100vh - var(--app-header-height) - var(--app-tabs-height));
  background: var(--app-main-bg);
  overflow: hidden;
}

.content-scrollbar {
  width: 100%;
  height: 100%;
}

.content-wrapper {
  width: 100%;
  padding: var(--app-padding-base);
  min-height: calc(100vh - var(--app-header-height) - var(--app-tabs-height));
  box-sizing: border-box;
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all var(--app-transition-base);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

// 移动端适配
@media (max-width: 768px) {
  .layout-main {
    margin-left: 0;
  }
}
</style>
