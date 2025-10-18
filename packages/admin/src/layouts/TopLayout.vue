<template>
  <div class="layout-top">
    <!-- 顶部栏 -->
    <div class="layout-header-wrapper">
      <Header />
    </div>

    <!-- 标签页 -->
    <div class="layout-tabs-wrapper">
      <TabsBar />
    </div>

    <!-- 内容区 -->
    <div class="layout-content">
      <el-scrollbar>
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
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import TabsBar from './components/TabsBar.vue'
</script>

<style scoped lang="scss">
.layout-top {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}

.layout-header-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--app-z-index-header);
}

.layout-tabs-wrapper {
  position: fixed;
  top: var(--app-header-height);
  right: 0;
  left: 0;
  z-index: var(--app-z-index-tabs);
}

.layout-content {
  flex: 1;
  margin-top: calc(var(--app-header-height) + var(--app-tabs-height));
  height: calc(100vh - var(--app-header-height) - var(--app-tabs-height));
  background: var(--app-main-bg);
}

.content-wrapper {
  padding: var(--app-padding-base);
  min-height: calc(100vh - var(--app-header-height) - var(--app-tabs-height));
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
</style>
