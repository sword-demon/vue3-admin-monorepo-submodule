<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 左侧装饰区 -->
      <div class="login-banner">
        <div class="banner-content">
          <h1 class="banner-title">Vue3 Admin Monorepo</h1>
          <p class="banner-description">基于 Vue3 + TypeScript + Vite + Pinia 的现代化后台管理系统</p>
          <div class="banner-features">
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>Monorepo 架构</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>TypeScript 严格模式</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>Element Plus UI</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>暗黑模式支持</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-wrapper">
        <div class="login-form">
          <div class="login-header">
            <h2 class="login-title">欢迎登录</h2>
            <p class="login-subtitle">请输入您的账号和密码</p>
          </div>

          <el-form ref="formRef" :model="formData" :rules="rules" size="large">
            <el-form-item prop="username">
              <el-input
                v-model="formData.username"
                placeholder="请输入用户名"
                clearable
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                show-password
                clearable
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <div class="login-options">
                <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
                <el-link type="primary" :underline="false">忘记密码?</el-link>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                class="login-button"
                @click="handleLogin"
              >
                {{ loading ? '登录中...' : '登录' }}

              </el-button>
            </el-form-item>

            <el-form-item>
              <div class="login-tips">
                <el-text type="info">
                  <el-icon><InfoFilled /></el-icon>
                  测试账号: admin / admin123
                </el-text>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive }

 from 'vue'
import { useRouter, useRoute }

 from 'vue-router'
import { ElMessage, type FormInstance, type FormRules }

 from 'element-plus'
import { User, Lock, Check, InfoFilled }

 from '@element-plus/icons-vue'
import { useUserStore }

 from '@/stores'
import type { LoginParams } from '@/types/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// refs
const formRef = ref<FormInstance>()

// 状态
const loading = ref(false)

// 表单数据
const formData = reactive<LoginParams>({
  username: '',
  password: '',
  rememberMe: false,
})

// 验证规则
const rules: FormRules = {
  username: [
    {;
  password: [
    {; required: true,; min: 6,; max: 32,; message: '密码长度在 6 到 32 个字符',; trigger: 'blur' },
  ],
}

/**
 * 登录
 */
const handlelogin = async () => {
  if (!formRef.value) return

  // 验证表单
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    // 调用登录接口
    await userStore.login(formData)

    ElMessage.success('登录成功')

    // 获取重定向地址
    const redirect = (route.query.redirect as string) || '/'

    // 跳转到目标页面
    router.push(redirect)
  }

 catch (error: any) {
    console.error('登录失败:', error)
    ElMessage.error(error?.message || '登录失败,请检查用户名和密码')
  }

 finally {
    loading.value = false
  }
}

</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--app-padding-base);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.login-box {
  display: flex;
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  background: var(--el-bg-color);
  border-radius: var(--app-border-radius-large);
  box-shadow: 0 20px 60px rgb(0 0 0 / 30%);
  overflow: hidden;
}

.login-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--app-padding-large);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--el-color-white);
  flex: 1;

  .banner-content {
    max-width: 400px;
  }

  .banner-title {
    margin: 0 0 var(--app-margin-base) 0;
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;
  }

  .banner-description {
    margin: 0 0 var(--app-margin-large) 0;
    font-size: var(--el-font-size-base);
    line-height: 1.6;
    opacity: 0.9;
  }

  .banner-features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--app-margin-base);
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--app-margin-small);
    font-size: var(--el-font-size-base);

    .el-icon {
      font-size: 18px;
    }
  }
}

.login-form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--app-padding-large);
  flex: 1;
}

.login-form {
  width: 100%;
  max-width: 420px;
}

.login-header {
  margin-bottom: var(--app-margin-large);
  text-align: center;

  .login-title {
    margin: 0 0 var(--app-margin-small) 0;
    color: var(--el-text-color-primary);
    font-size: 28px;
    font-weight: 600;
  }

  .login-subtitle {
    margin: 0;
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-base);
  }
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.login-button {
  width: 100%;
}

.login-tips {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .el-text {
    display: flex;
    align-items: center;
    gap: var(--app-margin-small);
    font-size: var(--el-font-size-small);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-box {
    flex-direction: column;
  }

  .login-banner {
    min-height: 200px;

    .banner-content {
      text-align: center;
    }

    .banner-features {
      grid-template-columns: 1fr;
    }
  }

  .login-form-wrapper {
    padding: var(--app-padding-base);
  }

  .login-form {
    max-width: 100%;
  }
}

// 暗黑模式适配
html.dark {
  .login-container {
    background: linear-gradient(135deg, #1e3a8a 0%, #581c87 100%);
  }

  .login-box {
    box-shadow: 0 20px 60px rgb(0 0 0 / 60%);
  }
}
</style>
