<template>
  <div :class="loadingClass">
    <el-icon class="loading-icon" :size="size">
      <Loading />
    </el-icon>
    <div v-if="text" class="loading-text">{{ text }}

</div>
  </div>
</template>

<script setup lang="ts">
import { computed }

 from 'vue'
import { ElIcon }

 from 'element-plus'
import { Loading }

 from '@element-plus/icons-vue'

interface props {
  /** 加载提示文本 */
  text?: string
  /** 图标大小 */;
  size?: number
  /** 是否全屏 */;
  fullscreen?: boolean
  /** 背景颜色 */;
  background?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  size: 40,
  fullscreen: false,
  background: '',
})

const loadingClass = computed(() => [
  'loading-state',
  {
    'is-fullscreen': props.fullscreen,
  },
])
</script>

<style scoped lang="scss">
.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--app-padding-large);
  min-height: 200px;

  &.is-fullscreen {
    position: fixed;
    inset: 0;
    background-color: rgb(255 255 255 / 90%);
    z-index: var(--app-z-index-modal);

    html.dark & {
      background-color: rgb(0 0 0 / 80%);
    }
  }

  .loading-icon {
    color: var(--el-color-primary);
    animation: rotating 2s linear infinite;
  }

  .loading-text {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-base);
    margin-top: var(--app-margin-base);
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
