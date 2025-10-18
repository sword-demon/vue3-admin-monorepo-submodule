import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { SystemSettings, SystemSettingsUpdateParams } from '@/types/system'
import { getSystemSettings, updateSystemSettings } from '@/api/system'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<SystemSettings | null>(null)
  const loading = ref(false)
  const saving = ref(false)

  const siteTitle = computed(() => settings.value?.siteTitle ?? 'Vue3 Admin')
  const siteLogo = computed(() => settings.value?.siteLogo ?? '')
  const siteFavicon = computed(() => settings.value?.siteFavicon ?? '')

  const fetchSettings = async (options: { force?: boolean } = {}) => {
    if (settings.value && !options.force) {
      return settings.value
    }

    loading.value = true
    try {
      const data = await getSystemSettings()
      const normalized = normalizeSettings(data)
      settings.value = normalized
      applyBranding(normalized)
      return settings.value
    } finally {
      loading.value = false
    }
  }

  const saveSettings = async (payload: SystemSettingsUpdateParams) => {
    saving.value = true
    try {
      const result = await updateSystemSettings(payload)
      const normalized = normalizeSettings(result)
      settings.value = normalized
      applyBranding(normalized)
      ElMessage.success('系统设置已保存')
      return settings.value
    } finally {
      saving.value = false
    }
  }

  const setSettings = (value: SystemSettings) => {
    settings.value = normalizeSettings(value)
  }

  return {
    settings,
    loading,
    saving,
    siteTitle,
    siteLogo,
    siteFavicon,
    fetchSettings,
    saveSettings,
    setSettings,
  }
})

function normalizeSettings(data: SystemSettings): SystemSettings {
  return {
    ...data,
    seoKeywords: Array.isArray(data.seoKeywords)
      ? data.seoKeywords
      : typeof data.seoKeywords === 'string'
        ? data.seoKeywords.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
  }
}

function applyBranding(data: SystemSettings | null) {
  if (!data) return

  if (data.siteTitle) {
    document.title = data.siteTitle
  }

  if (data.siteFavicon) {
    let link: HTMLLinkElement | null = document.querySelector("link[rel='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    if (link) {
      link.href = data.siteFavicon
    }
  }
}
