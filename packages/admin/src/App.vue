<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted }

 from 'vue'
import { useThemeStore } from '@/stores'

const themeStore = useThemeStore()

onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
  console.log('Vue3后台管理系统启动成功')
})
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
