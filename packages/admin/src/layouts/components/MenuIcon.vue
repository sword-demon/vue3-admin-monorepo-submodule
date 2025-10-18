<template>
  <el-icon v-if="icon">
    <component :is="iconComponent" />
  </el-icon>
</template>

<script setup lang="ts">
import { computed }

 from 'vue'
import * as elementplusiconsvue from '@element-plus/icons-vue'

interface props {
  /** 图标名称 */
  icon?: string
}

const props = defineProps<Props>()

// 图标组件
const iconComponent = computed(() => {
  if (!props.icon) return null

  // Element Plus 图标
  const iconName = props.icon.replace(/^i-ep-/, '')
  const pascalCase = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  const component = ElementPlusIconsVue[pascalCase as keyof typeof ElementPlusIconsVue]
  return component || null
})
</script>
