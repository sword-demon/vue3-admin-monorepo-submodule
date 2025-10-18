<template>
  <div class="home-page flex-col-center h-screen bg-gray-50">
    <h1 class="text-4xl font-bold text-primary mb-4">Vue3 后台管理系统</h1>
    <p class="text-gray-600 mb-8">基于 Vue3 + Vite + TypeScript + Element Plus</p>

    <el-space :size="20">
      <el-tag type="success" size="large">Vite 5.x</el-tag>
      <el-tag type="primary" size="large">Vue 3.4+</el-tag>
      <el-tag type="warning" size="large">TypeScript 5.x</el-tag>
      <el-tag type="danger" size="large">Element Plus 2.x</el-tag>
    </el-space>

    <div class="mt-8">
      <el-button type="primary" size="large" @click="handleStart">
        开始使用
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage }

 from 'element-plus'

const handlestart = () => {
  ElMessage.success('欢迎使用 Vue3 后台管理系统!')
}

</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
}
</style>
