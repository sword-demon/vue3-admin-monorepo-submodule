<template>
  <aside
    class="layout-sidebar"
    :class="{
      'is-collapsed': layoutStore.sidebarCollapsed,
      'is-mobile': layoutStore.deviceType === 'mobile',
      'show-mobile': layoutStore.showMobileSidebar,
    }"
  >
    <!-- Logo -->
    <div class="sidebar-logo">
      <SvgIcon icon="carbon:application" :size="32" color="var(--el-color-primary)" />
      <transition name="fade" mode="out-in">
        <span v-if="layoutStore.sidebarCollapsed" key="short" class="logo-text logo-text-short">
          VA
        </span>
        <span v-else key="full" class="logo-text">Vue3 Admin</span>
      </transition>
    </div>

    <!-- 菜单 -->
    <el-scrollbar class="sidebar-menu-wrapper">
      <Menu :collapse="layoutStore.sidebarCollapsed" />
    </el-scrollbar>

    <!-- 遮罩层(移动端) -->
    <div
      v-if="layoutStore.deviceType === 'mobile' && layoutStore.showMobileSidebar"
      class="sidebar-mask"
      @click="layoutStore.closeMobileSidebar()"
    ></div>
  </aside>
</template>

<script setup lang="ts">
import { SvgIcon }

 from '@/components/common'
import { useLayoutStore }

 from '@/stores'
import Menu from './Menu.vue'

const layoutStore = useLayoutStore()
</script>

<style scoped lang="scss">
.layout-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: var(--app-z-index-sidebar);
  width: var(--app-sidebar-width);
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  transition: width var(--app-transition-base);

  &.is-collapsed {
    width: var(--app-sidebar-collapsed-width);
  }
}

.sidebar-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--app-header-height);
  padding: 0 var(--app-padding-base);
  gap: var(--app-margin-small);
  border-bottom: 1px solid var(--el-border-color-light);

  .logo-text {
    color: var(--el-text-color-primary);
    font-size: var(--el-font-size-large);
    font-weight: 600;
    white-space: nowrap;
  }

  .logo-text-short {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
  }
}

.sidebar-menu-wrapper {
  height: calc(100vh - var(--app-header-height));
}

// 移动端样式
.layout-sidebar.is-mobile {
  transform: translateX(-100%);
  transition: transform var(--app-transition-base);

  &.show-mobile {
    transform: translateX(0);
  }
}

.sidebar-mask {
  position: fixed;
  inset: 0;
  z-index: calc(var(--app-z-index-sidebar) - 1);
  background: rgb(0 0 0 / 50%);
  animation: fadeIn 0.3s;
}

// 动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--app-transition-fast);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
