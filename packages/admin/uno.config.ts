import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        // Element Plus 图标集
        ep: () => import('@iconify-json/ep/icons.json').then(i => i.default),
        // 可以在这里添加更多图标集
        // carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
      },
    }),
  ],

  // 转换器 - 支持指令和变体组
  transformers: [transformerDirectives(), transformerVariantGroup()],

  // 快捷方式 - 常用组合样式
  shortcuts: {
    // 布局相关
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',
    'flex-start': 'flex justify-start items-center',
    'flex-end': 'flex justify-end items-center',
    'flex-col-center': 'flex flex-col justify-center items-center',
    'flex-col-start': 'flex flex-col justify-start items-start',
    'flex-wrap-center': 'flex flex-wrap justify-center items-center',

    // 定位相关
    'absolute-center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'absolute-x-center': 'absolute left-1/2 transform -translate-x-1/2',
    'absolute-y-center': 'absolute top-1/2 transform -translate-y-1/2',
    'fixed-center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',

    // 文本相关
    'text-overflow': 'overflow-hidden whitespace-nowrap text-ellipsis',
    'text-overflow-2': 'overflow-hidden line-clamp-2',
    'text-overflow-3': 'overflow-hidden line-clamp-3',

    // 按钮样式
    'btn-base':
      'px-4 py-2 rounded cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
    'btn-primary': 'btn-base bg-primary text-white hover:bg-primary-dark',
    'btn-success': 'btn-base bg-success text-white hover:bg-success-dark',
    'btn-warning': 'btn-base bg-warning text-white hover:bg-warning-dark',
    'btn-danger': 'btn-base bg-danger text-white hover:bg-danger-dark',
    'btn-info': 'btn-base bg-info text-white hover:bg-info-dark',

    // 卡片样式
    'card-base': 'bg-white dark:bg-dark rounded-lg p-4 shadow-sm',
    'card-hover': 'card-base hover:shadow-md transition-shadow duration-200',

    // 输入框样式
    'input-base':
      'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-primary transition-colors',

    // 标签样式
    'tag-base': 'inline-flex items-center px-2 py-1 text-sm rounded',
    'tag-primary': 'tag-base bg-primary-light-9 text-primary',
    'tag-success': 'tag-base bg-success-light-9 text-success',
    'tag-warning': 'tag-base bg-warning-light-9 text-warning',
    'tag-danger': 'tag-base bg-danger-light-9 text-danger',
    'tag-info': 'tag-base bg-info-light-9 text-info',

    // 链接样式
    'link-base': 'text-primary hover:text-primary-dark cursor-pointer transition-colors',

    // 分隔线
    'divider-base': 'h-px bg-gray-200 dark:bg-gray-700',
    'divider-vertical': 'w-px bg-gray-200 dark:bg-gray-700',

    // 滚动条
    'scrollbar-custom': 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100',
  },

  // 主题配置
  theme: {
    colors: {
      // Element Plus 颜色
      primary: {
        DEFAULT: 'var(--el-color-primary)',
        light: 'var(--el-color-primary-light-3)',
        lighter: 'var(--el-color-primary-light-5)',
        lightest: 'var(--el-color-primary-light-9)',
        dark: 'var(--el-color-primary-dark-2)',
      },
      success: {
        DEFAULT: 'var(--el-color-success)',
        light: 'var(--el-color-success-light-3)',
        lighter: 'var(--el-color-success-light-5)',
        lightest: 'var(--el-color-success-light-9)',
        dark: 'var(--el-color-success-dark-2)',
      },
      warning: {
        DEFAULT: 'var(--el-color-warning)',
        light: 'var(--el-color-warning-light-3)',
        lighter: 'var(--el-color-warning-light-5)',
        lightest: 'var(--el-color-warning-light-9)',
        dark: 'var(--el-color-warning-dark-2)',
      },
      danger: {
        DEFAULT: 'var(--el-color-danger)',
        light: 'var(--el-color-danger-light-3)',
        lighter: 'var(--el-color-danger-light-5)',
        lightest: 'var(--el-color-danger-light-9)',
        dark: 'var(--el-color-danger-dark-2)',
      },
      error: {
        DEFAULT: 'var(--el-color-error)',
      },
      info: {
        DEFAULT: 'var(--el-color-info)',
        light: 'var(--el-color-info-light-3)',
        lighter: 'var(--el-color-info-light-5)',
        lightest: 'var(--el-color-info-light-9)',
        dark: 'var(--el-color-info-dark-2)',
      },
      // 自定义应用颜色
      'app-bg': 'var(--app-bg-color)',
      'app-content-bg': 'var(--app-content-bg)',
      'app-hover-bg': 'var(--app-hover-bg)',
      'app-active-bg': 'var(--app-active-bg)',
    },
    breakpoints: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    spacing: {
      header: 'var(--app-header-height)',
      sidebar: 'var(--app-sidebar-width)',
      'sidebar-collapsed': 'var(--app-sidebar-collapsed-width)',
      tabs: 'var(--app-tabs-height)',
      footer: 'var(--app-footer-height)',
    },
    borderRadius: {
      small: 'var(--app-border-radius-small)',
      base: 'var(--app-border-radius-base)',
      large: 'var(--app-border-radius-large)',
      round: 'var(--app-border-radius-round)',
    },
    boxShadow: {
      light: 'var(--el-box-shadow-light)',
      base: 'var(--el-box-shadow)',
      dark: 'var(--el-box-shadow-dark)',
    },
    transitionDuration: {
      fast: 'var(--app-transition-fast)',
      base: 'var(--app-transition-base)',
      slow: 'var(--app-transition-slow)',
    },
  },

  // 自定义规则
  rules: [
    // 自定义 z-index 规则
    [/^z-header$/, () => ({ 'z-index': 'var(--app-z-index-header)' })],
    [/^z-sidebar$/, () => ({ 'z-index': 'var(--app-z-index-sidebar)' })],
    [/^z-tabs$/, () => ({ 'z-index': 'var(--app-z-index-tabs)' })],
    [/^z-drawer$/, () => ({ 'z-index': 'var(--app-z-index-drawer)' })],
    [/^z-modal$/, () => ({ 'z-index': 'var(--app-z-index-modal)' })],
    [/^z-notification$/, () => ({ 'z-index': 'var(--app-z-index-notification)' })],
    [/^z-message$/, () => ({ 'z-index': 'var(--app-z-index-message)' })],

    // 自定义间距规则
    [/^p-app-(\w+)$/, ([, size]) => ({ padding: `var(--app-padding-${size})` })],
    [/^m-app-(\w+)$/, ([, size]) => ({ margin: `var(--app-margin-${size})` })],

    // 文本截断行数
    [
      /^line-clamp-(\d+)$/,
      ([, lines]) => ({
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': lines,
        overflow: 'hidden',
      }),
    ],
  ],

  // 安全列表 - 确保这些类始终生成
  safelist: [
    'prose',
    'prose-sm',
    'prose-lg',
    'prose-xl',
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-6',
    'grid-cols-12',
  ],
})
