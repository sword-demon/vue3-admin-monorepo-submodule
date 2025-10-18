import { readFileSync } from 'node:fs'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'

const autoImportConfig = JSON.parse(
  readFileSync(new URL('./packages/admin/.eslintrc-auto-import.json', import.meta.url), 'utf-8')
)

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  localStorage: 'readonly',
  sessionStorage: 'readonly',
  navigator: 'readonly',
  location: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  requestAnimationFrame: 'readonly',
  cancelAnimationFrame: 'readonly',
  console: 'readonly',
  File: 'readonly',
  FileReader: 'readonly',
  Blob: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
}

export default tseslint.config(
  // 忽略文件
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.husky/**',
      '**/public/**',
      '**/*.config.js',
    ],
  },

  // 基础配置
  eslint.configs.recommended,

  // TypeScript 配置
  ...tseslint.configs.recommended,

  // Vue 配置
  ...pluginVue.configs['flat/recommended'],

  // 自定义规则
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tseslint.parser,
      },
      globals: {
        ...browserGlobals,
        ...autoImportConfig.globals,
      },
    },
    rules: {
      // TypeScript 规则
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/component-api-style': ['error', ['script-setup']],

      // 通用规则
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'off',
    },
  },

  // Vue 文件特殊配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },

  // Mock 数据与演示代码允许使用 any（便于快速构造数据）
  {
    files: ['packages/admin/mock/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // 业务视图层允许在模板脚本中临时使用 any，便于逐步重构
  {
    files: ['packages/admin/src/views/**/*.vue'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Prettier 配置(必须放在最后)
  prettierConfig
)
