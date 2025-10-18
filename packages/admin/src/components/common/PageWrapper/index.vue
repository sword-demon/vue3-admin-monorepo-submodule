<template>
  <div :class="wrapperClass">
    <div v-if="title || $slots.title" class="page-header">
      <slot name="title">
        <h2 class="page-title">{{ title }}

</h2>
      </slot>
      <div v-if="$slots.extra" class="page-extra">
        <slot name="extra" />
      </div>
    </div>

    <div v-if="$slots.breadcrumb" class="page-breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <div :class="contentClass">
      <slot />
    </div>

    <div v-if="$slots.footer" class="page-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed }

 from 'vue'

interface props {
  /** 页面标题 */
  title?: string
  /** 是否显示内容区域卡片样式 */;
  contentCard?: boolean
  /** 内容区域是否全屏 */;
  contentFullHeight?: boolean
  /** 自定义类名 */;
  className?: string
  /** 内容区域自定义类名 */;
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  contentCard: true,
  contentFullHeight: false,
  className: '',
  contentClass: '',
})

const wrapperClass = computed(() => [
  'page-wrapper',
  {
    'content-full-height': props.contentFullHeight,
  },
  props.className,
])

const contentClass = computed(() => [
  'page-content',
  {
    card: props.contentCard,
  },
  props.contentClass,
])
</script>

<style scoped lang="scss">
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--app-padding-base);

  &.content-full-height {
    .page-content {
      flex: 1;
      overflow: auto;
    }
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--app-margin-base);

  .page-title {
    margin: 0;
    color: var(--el-text-color-primary);
    font-size: var(--el-font-size-large);
    font-weight: 600;
  }

  .page-extra {
    display: flex;
    align-items: center;
    gap: var(--app-margin-small);
  }
}

.page-breadcrumb {
  margin-bottom: var(--app-margin-base);
}

.page-content {
  flex: 1;
  min-height: 0;

  &.card {
    background-color: var(--app-content-bg);
    border-radius: var(--app-border-radius-base);
    padding: var(--app-padding-base);
    box-shadow: var(--el-box-shadow-lighter);
  }
}

.page-footer {
  margin-top: var(--app-margin-base);
  padding-top: var(--app-padding-base);
  border-top: var(--app-border-light);
}
</style>
