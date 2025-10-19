<template>
  <div class="system-settings-page">
    <div class="page-header">
      <div class="page-title">
        <h2>系统设置</h2>
        <p>配置站点基础信息、品牌元素以及 SEO 元数据。</p>
      </div>
      <div class="page-actions">
        <el-button :loading="loading" @click="handleRefresh">
          <template #icon>
            <i class="i-ep-refresh" />
          </template>
          重新加载
        </el-button>
        <el-button type="primary" :loading="saving" @click="handleSubmit">
          <template #icon>
            <i class="i-ep-check" />
          </template>
          保存设置
        </el-button>
      </div>
    </div>

    <el-row :gutter="20" class="settings-content">
      <el-col :xs="24" :md="16">
        <el-card shadow="never" :loading="loading">
          <template #header>
            <div class="card-header">
              <span>基础信息</span>
              <el-tag size="small" type="info">实时保存前请点击“保存设置”</el-tag>
            </div>
          </template>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="120px"
            class="settings-form"
          >
            <el-form-item label="站点标题" prop="siteTitle">
              <el-input
                v-model="form.siteTitle"
                placeholder="请输入网站标题"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="副标题">
              <el-input
                v-model="form.siteSubtitle"
                placeholder="可选：副标题或标语"
                maxlength="120"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="Logo 地址" prop="siteLogo">
              <el-input v-model="form.siteLogo" placeholder="请输入 Logo 图片地址" clearable>
                <template #append>
                  <el-button text type="primary" @click="openLink(form.siteLogo)">预览</el-button>
                </template>
              </el-input>
              <div v-if="form.siteLogo" class="media-preview">
                <img :src="form.siteLogo" alt="Logo 预览" />
              </div>
            </el-form-item>

            <el-form-item label="Favicon 地址" prop="siteFavicon">
              <el-input v-model="form.siteFavicon" placeholder="请输入 Favicon 图标地址" clearable>
                <template #append>
                  <el-button text type="primary" @click="openLink(form.siteFavicon)"
                    >预览</el-button
                  >
                </template>
              </el-input>
              <div v-if="form.siteFavicon" class="media-preview favicon">
                <img :src="form.siteFavicon" alt="Favicon 预览" />
              </div>
            </el-form-item>

            <el-divider>SEO 设置</el-divider>

            <el-form-item label="SEO 关键词">
              <el-select
                v-model="form.seoKeywords"
                class="keyword-select"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="输入关键词后回车添加"
              >
                <el-option
                  v-for="item in form.seoKeywords"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="SEO 描述" prop="seoDescription">
              <el-input
                v-model="form.seoDescription"
                type="textarea"
                :rows="4"
                maxlength="300"
                show-word-limit
                placeholder="用于搜索引擎摘要描述"
              />
            </el-form-item>

            <el-form-item label="作者">
              <el-input v-model="form.seoAuthor" placeholder="页面作者/团队名称" maxlength="60" />
            </el-form-item>

            <el-divider>版权 & 备案</el-divider>

            <el-form-item label="版权信息">
              <el-input
                v-model="form.copyright"
                placeholder="例如：© 2025 公司名称"
                maxlength="120"
              />
            </el-form-item>

            <el-form-item label="备案号">
              <el-input
                v-model="form.icpNumber"
                placeholder="例如：粤ICP备12345678号"
                maxlength="60"
              />
            </el-form-item>

            <el-divider>统计脚本</el-divider>

            <el-form-item label="Analytics Script">
              <el-input
                v-model="form.analyticsScript"
                type="textarea"
                :rows="5"
                placeholder="可粘贴第三方统计脚本，例如 Google Analytics。"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="8">
        <el-card shadow="never" class="preview-card" :loading="loading">
          <template #header>
            <div class="card-header">
              <span>实时预览</span>
            </div>
          </template>

          <div class="preview-content">
            <div class="preview-logo">
              <img v-if="form.siteLogo" :src="form.siteLogo" alt="Logo" />
              <div v-else class="logo-placeholder">LOGO</div>
            </div>
            <h3>{{ form.siteTitle || '站点标题' }}</h3>
            <p v-if="form.siteSubtitle" class="subtitle">{{ form.siteSubtitle }}</p>

            <el-divider> <i class="i-ep-magic-stick" /> SEO </el-divider>
            <div class="preview-section">
              <h4>关键词</h4>
              <el-tag
                v-for="keyword in form.seoKeywords"
                :key="keyword"
                class="keyword-tag"
                size="small"
              >
                {{ keyword }}
              </el-tag>
            </div>
            <div class="preview-section">
              <h4>摘要</h4>
              <p class="description">{{ form.seoDescription || '暂无描述' }}</p>
            </div>

            <el-divider> <i class="i-ep-document"></i> Footer </el-divider>
            <div class="preview-section">
              <p>{{ form.copyright || '© 2025 公司名称' }}</p>
              <p v-if="form.icpNumber">备案号：{{ form.icpNumber }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores'
import type { SystemSettings } from '@/types/system'

const settingsStore = useSettingsStore()

const formRef = ref<FormInstance>()
const form = reactive({
  siteTitle: '',
  siteSubtitle: '',
  siteLogo: '',
  siteFavicon: '',
  seoKeywords: [] as string[],
  seoDescription: '',
  seoAuthor: '',
  copyright: '',
  icpNumber: '',
  analyticsScript: '',
})

const rules: FormRules = {
  siteTitle: [{ required: true, message: '请输入网站标题', trigger: 'blur' }],
  siteLogo: [{ required: true, message: '请上传网站Logo', trigger: 'change' }],
  siteFavicon: [
    { required: true, type: 'url', message: '请输入有效的网站图标URL', trigger: 'blur' },
  ],
  seoDescription: [
    { required: true, min: 10, message: '描述长度不少于 10 个字符', trigger: 'blur' },
  ],
}

const loading = computed(() => settingsStore.loading)
const saving = computed(() => settingsStore.saving)

const handleRefresh = async () => {
  await settingsStore.fetchSettings({ force: true })
}

const openLink = (url?: string) => {
  if (!url) return
  window.open(url, '_blank')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    ElMessage.warning('请完善必填项后再保存')
    return
  }

  const payload = {
    ...form,
    seoKeywords: normalizeKeywords(form.seoKeywords),
  }

  await settingsStore.saveSettings(payload)
}

const syncForm = (settings: SystemSettings | null) => {
  if (!settings) return
  form.siteTitle = settings.siteTitle || ''
  form.siteSubtitle = settings.siteSubtitle || ''
  form.siteLogo = settings.siteLogo || ''
  form.siteFavicon = settings.siteFavicon || ''
  form.seoKeywords = [...(settings.seoKeywords || [])]
  form.seoDescription = settings.seoDescription || ''
  form.seoAuthor = settings.seoAuthor || ''
  form.copyright = settings.copyright || ''
  form.icpNumber = settings.icpNumber || ''
  form.analyticsScript = settings.analyticsScript || ''
}

watch(
  () => settingsStore.settings,
  (value) => {
    syncForm(value ?? null)
  },
  { immediate: true }
)

onMounted(() => {
  settingsStore.fetchSettings().catch((error) => {
    console.warn('[Settings] fetchSettings failed:', error)
  })
})

function normalizeKeywords(keywords: string[]): string[] {
  const unique = new Set<string>()
  keywords.forEach((item) => {
    const value = item.trim()
    if (value) unique.add(value)
  })
  return Array.from(unique)
}
</script>

<style scoped lang="scss">
.system-settings-page {
  display: flex;
  flex-direction: column;
  gap: var(--app-margin-large);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--app-margin-base);

  .page-title {
    h2 {
      margin: 0 0 8px;
      font-size: 22px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: var(--el-text-color-secondary);
    }
  }

  .page-actions {
    display: flex;
    gap: var(--app-margin-small);
  }
}

.settings-form {
  .media-preview {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border: 1px solid var(--el-border-color-light);
    background: var(--el-fill-color-light);
    margin-top: 8px;
    border-radius: var(--app-border-radius-base);

    img {
      max-height: 64px;
      max-width: 180px;
      display: block;
      object-fit: contain;
    }

    &.favicon img {
      max-height: 32px;
      max-width: 32px;
    }
  }

  .keyword-select {
    width: 100%;
  }
}

.preview-card {
  .preview-content {
    display: flex;
    flex-direction: column;
    gap: var(--app-margin-base);
  }

  .preview-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    border: 1px dashed var(--el-border-color-darker);
    border-radius: var(--app-border-radius-base);
    background: var(--el-fill-color-lighter);

    img {
      max-width: 100%;
      max-height: 80px;
      object-fit: contain;
    }

    .logo-placeholder {
      color: var(--el-text-color-secondary);
      font-size: 18px;
    }
  }

  .subtitle {
    margin: 0;
    color: var(--el-text-color-secondary);
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h4 {
      margin: 0;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }

    .keyword-tag {
      margin-right: 6px;
      margin-bottom: 6px;
    }

    .description {
      margin: 0;
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }
  }
}

@media (width <= 992px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .preview-card {
    margin-top: var(--app-margin-base);
  }
}
</style>
