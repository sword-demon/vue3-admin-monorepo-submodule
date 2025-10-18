# 通用组件库

本目录包含项目中常用的通用组件,遵循单一职责原则和高度可复用性。

## 组件列表

### 1. SvgIcon - 图标组件

支持 Iconify 和 SVG sprite 两种图标方式。

**使用示例:**

```vue
<template>
  <!-- Iconify 图标 -->
  <SvgIcon icon="carbon:user" :size="24" color="#409eff" />

  <!-- SVG sprite 图标 -->
  <SvgIcon icon="home" :iconify="false" />
</template>
```

**Props:**

- `icon`: 图标名称
- `size`: 图标大小,默认 `1em`
- `color`: 图标颜色,默认 `currentColor`
- `iconify`: 是否使用 Iconify,默认 `true`
- `className`: 自定义类名

---

### 2. PageWrapper - 页面包装器

提供统一的页面布局结构,包含标题、面包屑、内容区域和底部。

**使用示例:**

```vue
<template>
  <PageWrapper title="用户管理" content-card content-full-height>
    <template #extra>
      <el-button type="primary">新增用户</el-button>
    </template>

    <template #breadcrumb>
      <el-breadcrumb>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </template>

    <!-- 页面内容 -->
    <div>内容区域</div>

    <template #footer>
      <el-pagination />
    </template>
  </PageWrapper>
</template>
```

**Props:**

- `title`: 页面标题
- `contentCard`: 内容区域是否显示卡片样式,默认 `true`
- `contentFullHeight`: 内容区域是否全屏,默认 `false`
- `className`: 自定义类名
- `contentClass`: 内容区域自定义类名

**Slots:**

- `title`: 自定义标题
- `extra`: 标题右侧操作区
- `breadcrumb`: 面包屑区域
- `default`: 内容区域
- `footer`: 底部区域

---

### 3. EmptyState - 空状态组件

用于展示无数据状态。

**使用示例:**

```vue
<template>
  <EmptyState description="暂无用户数据" show-action action-text="立即添加" @action="handleAdd" />
</template>
```

**Props:**

- `icon`: 图标名称,默认 `carbon:no-image`
- `iconSize`: 图标大小,默认 `80`
- `description`: 描述文本,默认 `'暂无数据'`
- `showAction`: 是否显示操作按钮,默认 `false`
- `actionText`: 操作按钮文本,默认 `'刷新'`
- `actionType`: 操作按钮类型,默认 `'primary'`

**Events:**

- `action`: 点击操作按钮时触发

**Slots:**

- `icon`: 自定义图标
- `default`: 自定义描述
- `action`: 自定义操作区域

---

### 4. LoadingState - 加载状态组件

用于展示加载状态。

**使用示例:**

```vue
<template>
  <!-- 局部加载 -->
  <LoadingState text="数据加载中..." />

  <!-- 全屏加载 -->
  <LoadingState text="正在处理..." fullscreen />
</template>
```

**Props:**

- `text`: 加载提示文本
- `size`: 图标大小,默认 `40`
- `fullscreen`: 是否全屏,默认 `false`
- `background`: 背景颜色

---

### 5. SearchForm - 搜索表单组件

快速构建搜索表单。

**使用示例:**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const searchForm = ref({
  username: '',
  status: '',
})

const searchItems = [
  { prop: 'username', label: '用户名', type: 'input' },
  { prop: 'status', label: '状态', type: 'select', props: { options: [...] } },
  { prop: 'date', label: '日期', type: 'daterange' },
]

const handleSearch = (values) => {
  console.log('搜索:', values)
}
</script>

<template>
  <SearchForm v-model="searchForm" :items="searchItems" @search="handleSearch" />
</template>
```

**Props:**

- `modelValue`: 表单数据
- `items`: 表单项配置
- `inline`: 是否行内表单,默认 `false`
- `labelWidth`: 标签宽度,默认 `'80px'`
- `gutter`: 栅格间隔,默认 `16`
- `defaultSpan`: 默认每项占据列数,默认 `6`
- `actionSpan`: 操作按钮占据列数,默认 `6`
- `collapsible`: 是否可折叠,默认 `true`
- `collapseCount`: 折叠时显示项数,默认 `3`

**Events:**

- `search`: 点击搜索按钮时触发
- `reset`: 点击重置按钮时触发
- `change`: 表单值变化时触发

---

### 6. DialogWrapper - 对话框包装器

封装 Element Plus Dialog,提供更便捷的 API。

**使用示例:**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

const handleConfirm = async () => {
  // 执行确认操作
  visible.value = false
}
</script>

<template>
  <DialogWrapper v-model="visible" title="用户详情" width="600px" @confirm="handleConfirm">
    <!-- 对话框内容 -->
  </DialogWrapper>
</template>
```

**Props:**

- `modelValue`: 是否显示
- `title`: 标题
- `width`: 宽度,默认 `'600px'`
- `fullscreen`: 是否全屏,默认 `false`
- `showFooter`: 是否显示底部,默认 `true`
- `showClose`: 是否显示关闭按钮,默认 `true`
- `closeOnClickModal`: 点击遮罩层是否关闭,默认 `true`
- `closeOnPressEscape`: 按下 ESC 是否关闭,默认 `true`
- `confirmText`: 确认按钮文本,默认 `'确定'`
- `cancelText`: 取消按钮文本,默认 `'取消'`
- `confirmLoading`: 确认按钮加载状态,默认 `false`
- `confirmDisabled`: 确认按钮禁用状态,默认 `false`

**Events:**

- `confirm`: 点击确认按钮时触发
- `cancel`: 点击取消按钮时触发
- `closed`: 对话框关闭后触发

**Slots:**

- `header`: 自定义标题
- `default`: 内容区域
- `footer`: 自定义底部

---

### 7. DrawerWrapper - 抽屉包装器

封装 Element Plus Drawer,提供更便捷的 API。

**使用示例:**

```vue
<template>
  <DrawerWrapper
    v-model="visible"
    title="用户设置"
    size="500px"
    direction="rtl"
    @confirm="handleConfirm"
  >
    <!-- 抽屉内容 -->
  </DrawerWrapper>
</template>
```

**Props:**

- `modelValue`: 是否显示
- `title`: 标题
- `size`: 抽屉大小,默认 `'30%'`
- `direction`: 抽屉方向,默认 `'rtl'`
- `showFooter`: 是否显示底部,默认 `true`
- 其他 Props 与 DialogWrapper 相同

**Events & Slots:**
与 DialogWrapper 相同

---

### 8. SliderCaptcha - 滑块验证码组件

基于 Canvas 实现的交互式滑块拼图验证码组件。

**使用示例:**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const captchaRef = ref()

const handleSuccess = (data: { x: number; y: number }) => {
  console.log('验证成功:', data)
  ElMessage.success('验证通过!')
  // 提交登录表单...
}

const handleFailed = () => {
  ElMessage.error('验证失败,请重试')
}

const handleRefresh = () => {
  console.log('刷新验证码')
}

// 手动刷新
const refresh = () => {
  captchaRef.value?.refresh()
}

// 手动重置
const reset = () => {
  captchaRef.value?.reset()
}
</script>

<template>
  <SliderCaptcha
    ref="captchaRef"
    :width="350"
    :height="200"
    :block-size="50"
    :tolerance="5"
    :image-url="customImageUrl"
    @success="handleSuccess"
    @failed="handleFailed"
    @refresh="handleRefresh"
  />
</template>
```

**Props:**

- `width`: 画布宽度,默认 `350`
- `height`: 画布高度,默认 `200`
- `blockSize`: 拼图块大小,默认 `50`
- `tolerance`: 验证允许的误差范围(像素),默认 `5`
- `imageUrl`: 自定义背景图片 URL,留空则使用随机图片

**Events:**

- `success`: 验证成功时触发,返回拼图位置 `{ x: number, y: number }`
- `failed`: 验证失败时触发
- `refresh`: 点击刷新按钮时触发

**Methods (通过 ref 调用):**

- `refresh()`: 刷新验证码,生成新的拼图
- `reset()`: 重置验证状态,清除滑块位置

**特性:**

- Canvas 绘制,支持自定义图片或随机图片
- 随机生成拼图位置,每次都不同
- 支持鼠标和触摸事件,移动端友好
- 验证成功/失败动画反馈
- 失败后自动重置并刷新
- 可配置验证容差,平衡用户体验与安全性

---

## 设计原则

### 1. 单一职责 (SRP)

每个组件只负责一个明确的功能,避免过度设计。

### 2. 高度可复用 (DRY)

组件设计考虑多场景使用,通过 Props 和 Slots 提供灵活性。

### 3. 保持简单 (KISS)

API 设计简洁直观,避免不必要的复杂性。

### 4. 需求驱动 (YAGNI)

仅实现当前明确需要的功能,不做过度预设。

---

## 使用规范

1. **导入方式**

   ```ts
   // 统一从 index.ts 导入
   import { SvgIcon, PageWrapper } from '@/components/common'
   ```

2. **Props 命名**
   - 使用驼峰命名法
   - 布尔类型以 `is`、`has`、`show` 开头
   - 事件回调以 `on` 开头

3. **插槽命名**
   - 使用语义化名称
   - 默认插槽用于主要内容
   - 具名插槽用于特定位置

4. **样式隔离**
   - 使用 `scoped` 避免样式污染
   - 优先使用 CSS 变量实现主题化

---

## 扩展指南

添加新组件时,请遵循以下步骤:

1. 在 `common` 目录下创建组件文件夹
2. 创建 `index.vue` 文件实现组件
3. 在 `common/index.ts` 中导出组件
4. 更新本 README 文档
5. 确保组件符合设计原则
