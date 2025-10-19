# Vue3 Admin Monorepo 项目文档

> 🚀 基于 Vue3 + TypeScript + Element Plus 的现代化管理系统

## 项目概述

这是一个功能完整的 Vue3 后台管理系统，采用 Monorepo 架构设计，具备完善的权限管理、内容管理、数据分析等核心功能。项目严格遵循工程最佳实践，代码规范统一，架构清晰，易于维护和扩展。

## ✨ 技术特性

- 🎯 **现代技术栈**: Vue 3.4+ + TypeScript + Vite
- 🎨 **UI 组件库**: Element Plus，提供丰富的企业级组件
- 🔥 **组合式 API**: 充分利用 Vue3 Composition API 优势
- 🗂️ **状态管理**: Pinia，轻量级状态管理方案
- 🛡️ **类型安全**: 完整的 TypeScript 类型定义
- 📦 **Monorepo 架构**: 支持多包管理和代码复用
- 🔧 **工程规范**: ESLint + Prettier + Stylelint
- 🎭 **Mock 数据**: 完整的 Mock API 支持

## 🏗️ 项目结构

```
vue3-admin-monorepo/
├── packages/
│   └── admin/                 # 后台管理系统主包
│       ├── src/
│       │   ├── components/     # 公共组件
│       │   │   ├── common/     # 通用组件
│       │   │   └── SvgIcon/    # SVG 图标组件
│       │   ├── layouts/        # 布局组件
│       │   │   ├── ClassicLayout.vue     # 经典布局
│       │   │   ├── TabsBar.vue           # 标签页栏
│       │   │   ├── Sidebar.vue           # 侧边栏
│       │   │   └── Header.vue            # 头部导航
│       │   ├── views/          # 页面组件
│       │   │   ├── home/       # 首页
│       │   │   ├── login/      # 登录页
│       │   │   ├── profile/    # 个人资料
│       │   │   ├── system/     # 系统管理
│       │   │   │   ├── settings/    # 系统设置
│       │   │   │   ├── menu/        # 菜单管理
│       │   │   │   ├── role/        # 角色管理
│       │   │   │   └── user/        # 用户管理
│       │   │   ├── content/    # 内容管理
│       │   │   │   ├── category/    # 分类管理
│       │   │   │   └── article/     # 文章管理
│       │   │   ├── analytics/  # 数据分析
│       │   │   │   ├── overview/    # 数据概览
│       │   │   │   └── report/      # 报表管理
│       │   │   └── error/      # 错误页面
│       │   ├── stores/         # 状态管理
│       │   │   ├── tabs.ts      # 标签页状态
│       │   │   ├── user.ts      # 用户状态
│       │   │   ├── layout.ts    # 布局状态
│       │   │   └── permission.ts # 权限状态
│       │   ├── api/           # API 接口
│       │   │   ├── system.ts   # 系统接口
│       │   │   ├── content.ts  # 内容接口
│       │   │   ├── analytics.ts # 数据接口
│       │   │   └── auth.ts     # 认证接口
│       │   ├── router/        # 路由配置
│       │   │   ├── index.ts    # 路由入口
│       │   │   └── asyncRoutes.ts # 动态路由
│       │   ├── utils/         # 工具函数
│       │   ├── hooks/         # 组合式函数
│       │   ├── types/         # 类型定义
│       │   ├── assets/        # 静态资源
│       │   └── styles/        # 样式文件
│       ├── public/            # 静态资源
│       ├── dist/              # 构建输出
│       └── package.json       # 包配置
├── .husky/                   # Git钩子
├── .gitignore                # Git 忽略文件
├── .gitmodules              # Git 子模块配置
├── .stylelintrc.js          # Stylelint 配置
├── pnpm-workspace.yaml      # pnpm workspace配置
└── README.md                # 项目文档
```

## 🎯 功能模块

### 🏠 首页仪表盘

- **数据概览**: 实时展示系统关键指标
- **快捷操作**: 常用功能快速入口
- **状态监控**: 系统运行状态实时监控
- **趋势分析**: 数据变化趋势图表

### 📊 数据分析模块

- **数据概览**:
  - 文章统计（发布、草稿、归档）
  - 用户统计（新增、活跃、总数）
  - 访问统计（浏览量、评论数）
- **趋势数据**: 多维度数据趋势分析
- **报表管理**:
  - 报表生成和导出
  - 多格式支持（Excel、PDF）
  - 批量操作和管理

### 📝 内容管理模块

- **文章管理**:
  - 文章列表、创建、编辑、删除
  - 富文本编辑器支持
  - 文章状态管理
  - 批量操作
- **分类管理**:
  - 分类层级管理
  - 分类统计信息
- **标签管理**: 标签创建和管理

### ⚙️ 系统管理模块

- **用户管理**:
  - 用户列表、创建、编辑、删除
  - 用户状态管理
  - 批量导入导出
- **角色管理**:
  - 角色权限配置
  - 权限分配管理
- **菜单管理**:
  - 动态菜单配置
  - 菜单权限控制
- **系统设置**:
  - 基础配置管理
  - 系统参数设置

### 👤 个人中心

- **个人资料**: 用户信息编辑
- **密码修改**: 安全密码更新
- **操作日志**: 用户行为记录

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 安装依赖
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 查看项目

### 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 代码检查

```bash
# ESLint 检查和修复
pnpm lint

# Prettier 格式化
pnpm format

# TypeScript 类型检查
pnpm type-check
```

## 🔧 技术栈

| 技术         | 版本   | 说明                            |
| ------------ | ------ | ------------------------------- |
| Vue          | 3.4+   | 渐进式 JavaScript 框架          |
| TypeScript   | 5.x    | JavaScript 的超集，提供静态类型 |
| Element Plus | 2.x    | Vue 3 UI 组件库                 |
| Pinia        | 2.x    | Vue 状态管理库                  |
| Vue Router   | 4.x    | Vue 官方路由管理器              |
| Vite         | 5.x    | 新一代前端构建工具              |
| UnoCSS       | latest | 原子化 CSS 引擎                 |
| ESLint       | latest | JavaScript 代码检查工具         |
| Prettier     | latest | 代码格式化工具                  |

## 🎨 特色功能

### 🎯 核心特性

- ✅ Monorepo 工程化架构
- ✅ 登录 + 滑动验证码
- ✅ 经典布局模式
- ✅ 主题系统(主题色切换、明暗模式)
- ✅ 全屏功能
- ✅ 智能标签页管理
- ✅ RBAC权限管理(按钮级)
- ✅ 系统配置(Logo、名称、SEO)
- ✅ Mock数据支持

### 🔥 技术亮点

- **类型安全**: 完整的 TypeScript 类型定义
- **组合式 API**: 充分利用 Vue3 新特性
- **自动化测试**: 完整的测试覆盖
- **代码规范**: 严格的代码质量控制
- **性能优化**: 懒加载、路由守卫等优化策略

## 📋 页面导航

| 模块     | 页面     | 路由路径              | 功能描述           |
| -------- | -------- | --------------------- | ------------------ |
| 首页     | 工作台   | `/`                   | 数据概览和快捷操作 |
| 系统管理 | 系统设置 | `/system/settings`    | 基础配置管理       |
| 系统管理 | 菜单管理 | `/system/menu`        | 动态菜单配置       |
| 系统管理 | 角色管理 | `/system/role`        | 角色权限管理       |
| 系统管理 | 用户管理 | `/system/user`        | 用户账号管理       |
| 内容管理 | 分类管理 | `/content/category`   | 内容分类管理       |
| 内容管理 | 文章管理 | `/content/article`    | 文章内容管理       |
| 数据分析 | 数据概览 | `/analytics/overview` | 数据统计概览       |
| 数据分析 | 报表管理 | `/analytics/report`   | 报表生成管理       |
| 个人中心 | 个人资料 | `/profile`            | 用户信息管理       |

## 🛠️ 开发指南

### 路由配置

项目采用动态路由配置，支持权限控制：

```typescript
// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: ClassicLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', affix: true },
      },
    ],
  },
]

// 动态路由（根据权限加载）
export const asyncRoutes: RouteRecordRaw[] = [
  // 需要权限的路由配置
]
```

### 状态管理

使用 Pinia 进行状态管理：

```typescript
// 示例：标签页状态管理
export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([])
  const activeTabPath = ref<string>('')

  const addTab = (route: RouteLocationNormalizedLoaded) => {
    // 添加标签逻辑
  }

  return {
    tabs,
    activeTabPath,
    addTab,
  }
})
```

### 组件开发规范

```vue
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const data = ref()

// 计算属性
const computedData = computed(() => {
  return data.value?.processed
})

// 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped lang="scss">
// 样式定义
</style>
```

## 📝 代码规范

### 命名规范

- **组件**: PascalCase (如 `UserList.vue`)
- **文件**: kebab-case (如 `user-management.ts`)
- **变量/函数**: camelCase (如 `getUserList`)
- **常量**: UPPER_SNAKE_CASE (如 `API_BASE_URL`)

### Git 提交规范

```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

_本文档更新于 ${new Date().toLocaleString('zh-CN')}_
