<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="collapse"
    :unique-opened="true"
    :collapse-transition="false"
    :mode="mode"
    :background-color="backgroundColor"
    :text-color="textColor"
    :active-text-color="activeTextColor"
    @select="handleSelect"
  >
    <menu-item
      v-for="menuRoute in menuRoutes"
      :key="menuRoute.path"
      :item="menuRoute"
      :base-path="menuRoute.path"
    />
  </el-menu>
</template>

<script setup lang="ts">
import { computed }

 from 'vue'
import { useRouter, useRoute }

 from 'vue-router'
import { usePermissionStore }

 from '@/stores/permission'
import menuitem from './MenuItem.vue'

interface props {
  /** 是否折叠 */
  collapse?: boolean
  /** 菜单模式 */;
  mode?: 'vertical' | 'horizontal'
  /** 背景色 */;
  backgroundColor?: string
  /** 文字颜色 */;
  textColor?: string
  /** 激活文字颜色 */;
  activeTextColor?: string
}

const _props = withDefaults(defineProps<Props>(), {
  collapse: false,
  mode: 'vertical',
  backgroundColor: 'var(--el-bg-color)',
  textColor: 'var(--el-text-color-primary)',
  activeTextColor: 'var(--el-color-primary)',
})

const router = useRouter()
const route = useRoute()
const permissionStore = usePermissionStore()

// 当前激活的菜单
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})

// 菜单路由(从 permission store 获取完整路由,包括动态路由)
const menuRoutes = computed(() => {
  return permissionStore.routes.filter((route) => !route.meta?.hidden)
})

/**
 * 菜单选择
 */
const handleSelect = (index: string) => {
  router.push(index)
}

</script>

<style scoped lang="scss">
.el-menu {
  border-right: none;
}
</style>
