# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## 项目架构

这是一个基于pnpm workspace的Monorepo架构的Vue3后台管理系统：

- **packages/admin**: 主应用（Vue3 + TypeScript + Vite + Element Plus）
- **packages/shared**: 共享包，包含常量、类型定义和工具函数

### 包管理器

使用 `pnpm` 作为包管理器，版本要求 >=8.0.0。不要使用npm或yarn。

## 常用开发命令

### 安装依赖

```bash
pnpm install
```

### 开发调试

```bash
pnpm dev              # 启动admin包的开发服务器
```

### 构建

```bash
pnpm build            # 构建admin包
pnpm preview          # 预览构建结果
```

### 代码质量检查

```bash
pnpm lint             # ESLint检查并自动修复
pnpm format           # Prettier代码格式化
pnpm type-check       # 所有包的TypeScript类型检查
```

### 单包操作

```bash
# 对特定包执行命令
pnpm --filter @vue3-admin/admin <command>
pnpm --filter @vue3-admin/shared <command>

# 对所有包执行命令
pnpm -r run <command>
```

## 技术栈与架构要点

### 主要技术

- **构建**: Vite 5.x
- **框架**: Vue 3.4+ (Composition API)
- **UI库**: Element Plus 2.x (支持自动导入)
- **状态管理**: Pinia 2.x
- **路由**: Vue Router 4.x
- **样式**: UnoCSS (原子化CSS) + Sass
- **HTTP**: Axios
- **类型检查**: TypeScript 5.x (严格模式)

### 关键配置

- **自动导入**: Element Plus组件和Vue/Vue Router/Pinia API自动导入
- **路径别名**: `@` 指向 `packages/admin/src`，`@vue3-admin/shared` 指向共享包
- **开发代理**: `/api` 代理到 `http://localhost:8080`
- **构建优化**: 代码分割，Vue和Element Plus单独打包

### 代码组织规范

- **layouts/**: 布局组件（经典布局、双栏布局）
- **views/**: 页面组件
- **components/**: 公共组件
- **stores/**: Pinia状态管理
- **router/**: 路由配置和守卫
- **api/**: 接口定义
- **utils/**: 工具函数
- **types/**: TypeScript类型定义

## 共享包使用

从 `@vue3-admin/shared` 导入共享代码：

```typescript
import { someConstant } from '@vue3-admin/shared'
import type { CommonType } from '@vue3-admin/shared'
```

## 代码规范

- 遵循 Conventional Commits 提交规范
- 使用 Husky + lint-staged 进行提交前检查
- TypeScript 严格模式
- 使用 ESLint + Prettier + Stylelint 保证代码质量

## 权限系统

路由级权限通过 `meta.permissions` 配置，支持按钮级别的RBAC权限管理。

## 开发注意事项

- 新增页面需在router中配置路由和meta信息
- 使用UnoCSS原子化CSS优先，避免写自定义样式
- API调用统一通过axios实例，配置了/api代理
- 主题系统支持主题色切换和明暗模式
- 使用Element Plus的自动导入，无需手动import组件
