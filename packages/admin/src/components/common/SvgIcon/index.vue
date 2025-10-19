<template>
  <Icon
    v-if="isIconify"
    :icon="props.icon"
    :style="iconStyle"
    :class="['svg-icon', 'iconify', props.className]"
  />
  <svg v-else :class="svgClass" :style="iconStyle" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  /** 图标名称 */
  icon: string
  /** 图标大小 */
  size?: string | number
  /** 图标颜色 */
  color?: string
  /** 是否使用 Iconify */
  iconify?: boolean
  /** 自定义类名 */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '1em',
  color: 'currentColor',
  iconify: true,
  className: '',
})

// 是否为 Iconify 图标
const isIconify = computed(() => props.iconify && props.icon.includes(':'))

// SVG sprite 图标名称
const iconName = computed(() => `#icon-${props.icon}`)

// SVG 类名
const svgClass = computed(() => {
  return ['svg-icon', props.className]
})

// 图标样式
const iconStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: size,
    height: size,
    color: props.color,
  }
})
</script>

<style scoped lang="scss">
.svg-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  fill: currentcolor;
  overflow: hidden;

  &.iconify {
    font-size: inherit;
  }
}
</style>
