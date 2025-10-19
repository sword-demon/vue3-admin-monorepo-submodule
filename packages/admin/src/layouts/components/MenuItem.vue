<template>
  <!-- 有子菜单 -->
  <el-sub-menu v-if="hasChildren" :index="resolvePath(item.path)">
    <template #title>
      <menu-icon :icon="item.meta?.icon" />
      <span>{{ item.meta?.title }}</span>
    </template>
    <menu-item
      v-for="child in visibleChildren"
      :key="child.path"
      :item="child"
      :base-path="resolvePath(item.path)"
    />
  </el-sub-menu>

  <!-- 无子菜单 -->
  <el-menu-item v-else :index="resolvePath(item.path)">
    <menu-icon :icon="item.meta?.icon" />
    <template #title>
      <span>{{ item.meta?.title }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import MenuIcon from './MenuIcon.vue'

// 定义组件名称,用于递归
defineOptions({
  name: 'MenuItem',
})

interface Props {
  /** 路由项 */
  item: RouteRecordRaw
  /** 基础路径 */
  basePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  basePath: '',
})

// 是否有子菜单
const hasChildren = computed(() => {
  const children = props.item.children || []
  // 过滤隐藏的子路由
  const showChildren = children.filter((child) => !child.meta?.hidden)
  return showChildren.length > 0
})

// 可见的子菜单
const visibleChildren = computed(() => {
  const children = props.item.children || []
  return children.filter((child) => !child.meta?.hidden)
})

// 解析完整路径
const resolvePath = (path: string): string => {
  if (path.startsWith('/')) {
    return path
  }

  return `${props.basePath}/${path}`.replace(/\/+/g, '/')
}
</script>
