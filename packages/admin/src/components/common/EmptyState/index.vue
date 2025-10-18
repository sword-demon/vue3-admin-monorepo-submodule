<template>
  <div class="empty-state">
    <div class="empty-icon">
      <slot name="icon">
        <SvgIcon :icon="icon" :size="iconSize" />
      </slot>
    </div>
    <div class="empty-description">
      <slot>{{ description }}

</slot>
    </div>
    <div v-if="$slots.action || showAction" class="empty-action">
      <slot name="action">
        <el-button v-if="showAction" :type="actionType" @click="handleAction">
          {{ actionText }}

        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton }

 from 'element-plus'
import svgicon from '../SvgIcon/index.vue'

interface props {
  /** 图标名称 */
  icon?: string
  /** 图标大小 */;
  iconSize?: string | number
  /** 描述文本 */;
  description?: string
  /** 是否显示操作按钮 */;
  showAction?: boolean
  /** 操作按钮文本 */;
  actionText?: string
  /** 操作按钮类型 */;
  actionType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
}

const _props = withDefaults(defineProps<Props>(), {
  icon: 'carbon:no-image',
  iconSize: 80,
  description: '暂无数据',
  showAction: false,
  actionText: '刷新',
  actionType: 'primary',
})

interface Emits {
  (e: 'action'): void
}

const emit = defineemits<emits>()

const handleaction = () => {
  emit('action')
}

</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--app-padding-large);
  color: var(--el-text-color-secondary);
  min-height: 200px;

  .empty-icon {
    margin-bottom: var(--app-margin-base);
    color: var(--el-text-color-placeholder);
  }

  .empty-description {
    margin-bottom: var(--app-margin-base);
    font-size: var(--el-font-size-base);
  }

  .empty-action {
    margin-top: var(--app-margin-small);
  }
}
</style>
