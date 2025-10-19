<template>
  <div class="slider-captcha">
    <div class="captcha-canvas-wrapper" :style="{ width: `${width}px`, height: `${height}px` }">
      <!-- 背景图 -->
      <canvas ref="canvasRef" :width="width" :height="height" class="captcha-canvas"></canvas>

      <!-- 滑块图 -->
      <canvas
        ref="blockRef"
        :width="width"
        :height="height"
        :style="{ left: `${blockX}px` }"
        class="captcha-block"
      ></canvas>

      <!-- 验证成功提示 -->
      <div v-if="isSuccess" class="captcha-success">
        <el-icon class="success-icon">
          <SuccessFilled />
        </el-icon>
        <span>验证成功</span>
      </div>

      <!-- 验证失败提示 -->
      <div v-if="isFailed" class="captcha-failed">
        <el-icon class="failed-icon">
          <CircleCloseFilled />
        </el-icon>
        <span>验证失败</span>
      </div>

      <!-- 刷新按钮 -->
      <div class="captcha-refresh" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon>
      </div>
    </div>

    <div class="slider-track" :class="{ success: isSuccess, failed: isFailed }">
      <div class="slider-track-bg" :style="{ width: `${sliderLeft}px` }"></div>

      <div
        ref="sliderRef"
        class="slider-button"
        :style="{ left: `${sliderLeft}px` }"
        @mousedown="handleDragStart"
        @touchstart="handleDragStart"
      >
        <el-icon>
          <DArrowRight />
        </el-icon>
      </div>

      <span class="slider-text">{{ sliderText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElIcon } from 'element-plus'
import { Refresh, DArrowRight, SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'

interface Props {
  /** 画布宽度 */
  width?: number
  /** 画布高度 */
  height?: number
  /** 滑块大小 */
  blockSize?: number
  /** 验证允许的误差范围 */
  tolerance?: number
  /** 背景图URL */
  imageUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 350,
  height: 200,
  blockSize: 50,
  tolerance: 5,
  imageUrl: '',
})

interface Emits {
  (e: 'success', data: { x: number; y: number }): void
  (e: 'failed'): void
  (e: 'refresh'): void
}

const emit = defineEmits<Emits>()

// refs
const canvasRef = ref<HTMLCanvasElement>()
const blockRef = ref<HTMLCanvasElement>()
const sliderRef = ref<HTMLDivElement>()

// 状态
const blockX = ref(0)
const blockY = ref(0)
const sliderLeft = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const isSuccess = ref(false)
const isFailed = ref(false)

// 滑块文本
const sliderText = computed(() => {
  if (isSuccess.value) return '验证成功'
  if (isFailed.value) return '验证失败'
  return '向右滑动滑块填充拼图'
})

/**
 * 生成随机数
 */
const randomNum = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min)
}

/**
 * 创建拼图路径
 */
const createBlockPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void => {
  const r = size / 4 // 圆的半径
  const PI = Math.PI

  // 绘制拼图块路径
  ctx.beginPath()
  ctx.moveTo(x, y)

  // 上边 - 凸起
  ctx.lineTo(x + size / 2 - r, y)
  ctx.arc(x + size / 2, y, r, -PI, 0, false)
  ctx.lineTo(x + size, y)

  // 右边 - 凸起
  ctx.lineTo(x + size, y + size / 2 - r)
  ctx.arc(x + size, y + size / 2, r, -PI / 2, PI / 2, false)
  ctx.lineTo(x + size, y + size)

  // 下边
  ctx.lineTo(x, y + size)

  // 左边 - 凹陷
  ctx.lineTo(x, y + size / 2 + r)
  ctx.arc(x, y + size / 2, r, PI / 2, (PI * 3) / 2, true)
  ctx.lineTo(x, y)

  ctx.closePath()
}

/**
 * 绘制图片
 */
const drawImage = (img: HTMLImageElement): void => {
  const canvas = canvasRef.value
  const block = blockRef.value
  if (!canvas || !block) return

  const canvasCtx = canvas.getContext('2d')
  const blockCtx = block.getContext('2d')
  if (!canvasCtx || !blockCtx) return

  // 随机生成拼图位置
  const x = randomNum(props.blockSize + 10, props.width - props.blockSize - 10)
  const y = randomNum(10, props.height - props.blockSize - 10)
  blockX.value = x
  blockY.value = y

  // 绘制背景图
  canvasCtx.clearRect(0, 0, props.width, props.height)
  canvasCtx.drawImage(img, 0, 0, props.width, props.height)

  // 在背景图上绘制拼图路径并剪切
  createBlockPath(canvasCtx, x, y, props.blockSize)
  canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  canvasCtx.fill()
  canvasCtx.globalCompositeOperation = 'destination-over'
  canvasCtx.drawImage(img, 0, 0, props.width, props.height)

  // 绘制滑块
  blockCtx.clearRect(0, 0, props.width, props.height)
  blockCtx.save()
  createBlockPath(blockCtx, x, y, props.blockSize)
  blockCtx.clip()
  blockCtx.drawImage(img, 0, 0, props.width, props.height)
  blockCtx.restore()
}

/**
 * 加载图片
 */
const loadImage = (): void => {
  const img = new Image()
  img.crossOrigin = 'Anonymous'

  // 使用提供的图片URL或随机图片
  img.src =
    props.imageUrl || `https://picsum.photos/${props.width}/${props.height}?random=${Math.random()}`

  img.onload = () => {
    drawImage(img)
  }

  img.onerror = () => {
    console.error('图片加载失败')
  }
}

/**
 * 刷新验证码
 */
const handleRefresh = (): void => {
  reset()
  loadImage()
  emit('refresh')
}

/**
 * 开始拖动
 */
const handleDragStart = (e: MouseEvent | TouchEvent): void => {
  if (isSuccess.value || isFailed.value) return

  isDragging.value = true
  startX.value = 'touches' in e ? e.touches[0].clientX : e.clientX

  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('touchmove', handleDragMove)
  document.addEventListener('touchend', handleDragEnd)
}

/**
 * 拖动中
 */
const handleDragMove = (e: MouseEvent | TouchEvent): void => {
  if (!isDragging.value) return

  e.preventDefault()

  const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX
  let moveX = currentX - startX.value

  // 限制滑块移动范围
  if (moveX < 0) moveX = 0
  if (moveX > props.width - props.blockSize) moveX = props.width - props.blockSize

  sliderLeft.value = moveX
}

/**
 * 拖动结束
 */
const handleDragEnd = (): void => {
  if (!isDragging.value) return

  isDragging.value = false

  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)

  // 验证位置
  verify()
}

/**
 * 验证
 */
const verify = (): void => {
  const diff = Math.abs(sliderLeft.value - blockX.value)

  if (diff <= props.tolerance) {
    // 验证成功
    isSuccess.value = true
    emit('success', { x: blockX.value, y: blockY.value })
  } else {
    // 验证失败
    isFailed.value = true
    emit('failed')

    // 1秒后重置
    setTimeout(() => {
      reset()
      loadImage()
    }, 1000)
  }
}

/**
 * 重置
 */
const reset = (): void => {
  blockX.value = 0
  blockY.value = 0
  sliderLeft.value = 0
  isDragging.value = false
  isSuccess.value = false
  isFailed.value = false
}

onMounted(() => {
  loadImage()
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)
})

// 暴露方法
defineExpose({
  refresh: handleRefresh,
  reset,
})
</script>

<style scoped lang="scss">
.slider-captcha {
  user-select: none;

  .captcha-canvas-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: var(--app-border-radius-base);
    background: var(--el-fill-color);
  }

  .captcha-canvas,
  .captcha-block {
    display: block;
  }

  .captcha-block {
    position: absolute;
    top: 0;
    left: 0;
  }

  .captcha-success,
  .captcha-failed {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgb(0 0 0 / 50%);
    color: var(--el-color-white);
    font-size: var(--el-font-size-large);
    gap: var(--app-margin-small);
    font-weight: 600;
    animation: fadeIn 0.3s;

    .success-icon {
      color: var(--el-color-success);
      font-size: 48px;
    }

    .failed-icon {
      color: var(--el-color-danger);
      font-size: 48px;
    }
  }

  .captcha-refresh {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    background: rgb(0 0 0 / 50%);
    color: var(--el-color-white);
    border-radius: 50%;
    cursor: pointer;
    transition: all var(--app-transition-fast);

    &:hover {
      background: rgb(0 0 0 / 70%);
      transform: rotate(180deg);
    }
  }

  .slider-track {
    position: relative;
    margin-top: var(--app-margin-base);
    height: 44px;
    background: var(--el-fill-color-light);
    border-radius: var(--app-border-radius-round);
    overflow: hidden;
    transition: all var(--app-transition-base);

    &.success {
      .slider-track-bg {
        background: var(--el-color-success);
      }

      .slider-button {
        background: var(--el-color-success);
      }
    }

    &.failed {
      .slider-track-bg {
        background: var(--el-color-danger);
      }

      .slider-button {
        background: var(--el-color-danger);
      }

      animation: shake 0.5s;
    }
  }

  .slider-track-bg {
    height: 100%;
    background: var(--el-color-primary-light-9);
    transition: all var(--app-transition-fast);
  }

  .slider-button {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    background: var(--el-color-primary);
    color: var(--el-color-white);
    font-size: 20px;
    border-radius: 50%;
    cursor: pointer;
    transition: all var(--app-transition-fast);
    box-shadow: 0 0 4px rgb(0 0 0 / 20%);

    &:hover {
      background: var(--el-color-primary-light-3);
    }
  }

  .slider-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-base);
    pointer-events: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-10px);
  }

  75% {
    transform: translateX(10px);
  }
}
</style>
