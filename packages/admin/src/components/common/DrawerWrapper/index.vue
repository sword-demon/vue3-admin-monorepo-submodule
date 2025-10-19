<template>
  <el-drawer
    v-model="visible"
    :title="title"
    :size="size"
    :direction="direction"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    @closed="handleClosed"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <div :class="contentClass">
      <slot />
    </div>

    <template v-if="showFooter" #footer>
      <slot name="footer">
        <div class="drawer-footer">
          <el-button @click="handleCancel">{{ cancelText }}</el-button>
          <el-button
            type="primary"
            :loading="confirmLoading"
            :disabled="confirmDisabled"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </el-button>
        </div>
      </slot>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElDrawer, ElButton } from 'element-plus'

interface Props {
  /** 是否显示 */
  modelValue: boolean
  /** 标题 */
  title?: string
  /** 抽屉大小 */
  size?: string | number
  /** 抽屉方向 */
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
  /** 是否显示底部 */
  showFooter?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnClickModal?: boolean
  /** 按下 ESC 是否关闭 */
  closeOnPressEscape?: boolean
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认按钮加载状态 */
  confirmLoading?: boolean
  /** 确认按钮禁用状态 */
  confirmDisabled?: boolean
  /** 内容自定义类名 */
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: '30%',
  direction: 'rtl',
  showFooter: true,
  showClose: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  confirmText: '确定',
  cancelText: '取消',
  confirmLoading: false,
  confirmDisabled: false,
  contentClass: '',
})

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'closed'): void
}

const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}

const handleClosed = () => {
  emit('closed')
}
</script>

<style scoped lang="scss">
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--app-margin-small);
}
</style>
