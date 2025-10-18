# Vue3 Admin Monorepo

基于 Vue3 + TypeScript + Vite 的企业级后台管理系统。

## 项目结构

```
vue3-admin-monorepo/
├── packages/
│   ├── admin/          # 主应用
│   └── shared/         # 共享包(常量、类型、工具)
├── .husky/             # Git钩子
├── pnpm-workspace.yaml # pnpm workspace配置
└── package.json        # 根配置
```

## 技术栈

- **构建工具**: Vite 5.x
- **UI框架**: Vue 3.4+ with Composition API
- **UI组件库**: Element Plus 2.x
- **状态管理**: Pinia 2.x
- **路由**: Vue Router 4.x
- **HTTP**: Axios
- **CSS方案**: UnoCSS (原子化CSS)
- **类型检查**: TypeScript 5.x
- **代码规范**: ESLint + Prettier + Stylelint
- **提交规范**: Husky + Commitlint

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

### 代码检查

```bash
# ESLint检查和修复
pnpm lint

# Prettier格式化
pnpm format

# TypeScript类型检查
pnpm type-check
```

## 功能特性

- ✅ Monorepo 工程化架构
- ✅ 登录 + 滑动验证码
- ✅ 2种布局模式(经典布局、双栏布局)
- ✅ 主题系统(主题色切换、明暗模式)
- ✅ 全屏功能
- ✅ 标签页管理
- ✅ RBAC权限管理(按钮级)
- ✅ 系统配置(Logo、名称、SEO)
- ✅ Mock数据

## 开发规范

- 使用 `pnpm` 作为包管理器
- 遵循 Conventional Commits 提交规范
- 提交前自动进行代码检查和格式化
- TypeScript 严格模式

## License

MIT
