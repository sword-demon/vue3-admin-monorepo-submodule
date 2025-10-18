<!--
 * 重定向页面
 * 用于实现页面刷新功能
 * 工作原理:
 * 1. 用户点击刷新按钮
 * 2. 跳转到 /redirect + 原路径
 * 3. 该页面立即重定向回原路径
 * 4. 触发路由重新加载,实现刷新效果
 -->
<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted }

 from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  // 获取目标路径(去除 /redirect 前缀)
  const targetPath = route.path.replace(/^\/redirect/, '')

  // 立即重定向到目标路径
  router.replace({
    path: targetPath || '/',
    query: route.query,
    params: route.params,
  })
})
</script>
