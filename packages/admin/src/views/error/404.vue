<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-title">页面不存在</div>
      <div class="error-desc">抱歉,您访问的页面不存在</div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter }

 from 'vue-router'

const router = userouter()

const gohome = () => {
  router.push('/')
}

const goback = () => {
  router.back()
}

</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-content {
  color: #fff;
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 0 4px 8px rgb(0 0 0 / 20%);
}

.error-title {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 16px;
}

.error-desc {
  font-size: 16px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
