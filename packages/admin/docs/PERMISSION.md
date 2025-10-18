# 权限系统说明文档

## 角色权限映射

系统定义了四种角色，每个角色拥有不同的权限范围：

### 1. 超级管理员（Super Admin）

- **角色代码**: `super_admin`
- **权限范围**: 所有权限 (`*:*:*`)
- **测试账号**:
  - 用户名: `super_admin`
  - 密码: `super_admin123`
- **说明**: 拥有系统所有功能的完全访问权限

### 2. 管理员（Admin）

- **角色代码**: `admin`
- **权限范围**:
  - 系统管理（用户、角色、菜单）
  - 内容管理（文章、分类）
  - 数据分析（概览、报表）
- **测试账号**:
  - 用户名: `admin`
  - 密码: `admin123`
- **说明**: 拥有大部分管理权限，但不能修改核心系统配置

### 3. 编辑员（Editor）

- **角色代码**: `editor`
- **权限范围**:
  - 内容管理（文章的查看、创建、编辑）
  - 分类查看
  - 数据概览查看
- **测试账号**:
  - 用户名: `editor`
  - 密码: `editor123`
- **说明**: 主要负责内容编辑，无法删除内容或访问系统管理

### 4. 普通用户（User）

- **角色代码**: `user`
- **权限范围**:
  - 内容查看（文章、分类的只读访问）
- **测试账号**:
  - 用户名: `user`
  - 密码: `user123`
- **说明**: 仅拥有基础的查看权限

## 权限代码格式

权限代码采用三段式命名：`模块:资源:操作`

### 系统管理权限

```
system:user:list      # 用户列表查看
system:user:create    # 创建用户
system:user:edit      # 编辑用户
system:user:delete    # 删除用户
system:user:view      # 查看用户详情

system:role:list      # 角色列表查看
system:role:create    # 创建角色
system:role:edit      # 编辑角色
system:role:delete    # 删除角色
system:role:view      # 查看角色详情

system:menu:list      # 菜单列表查看
system:menu:create    # 创建菜单
system:menu:edit      # 编辑菜单
system:menu:delete    # 删除菜单
system:menu:view      # 查看菜单详情
```

### 内容管理权限

```
content:article:list      # 文章列表查看
content:article:create    # 创建文章
content:article:edit      # 编辑文章
content:article:delete    # 删除文章
content:article:view      # 查看文章详情
content:article:publish   # 发布文章

content:category:list     # 分类列表查看
content:category:create   # 创建分类
content:category:edit     # 编辑分类
content:category:delete   # 删除分类
content:category:view     # 查看分类详情
```

### 数据分析权限

```
analytics:overview:view   # 查看数据概览
analytics:report:view     # 查看报表
analytics:report:export   # 导出报表
```

## 使用方式

### 1. 在模板中使用指令

```vue
<!-- 单个权限检查 -->
<el-button v-permission="'content:article:create'">创建文章</el-button>

<!-- 多个权限检查（任意一个满足） -->
<el-button v-permission="['content:article:edit', 'content:article:delete']">
  操作
</el-button>

<!-- 多个权限检查（全部满足） -->
<el-button v-permission:all="['content:article:edit', 'content:article:publish']">
  编辑并发布
</el-button>

<!-- 角色检查 -->
<el-button v-role="'admin'">管理员功能</el-button>
<el-button v-role="['admin', 'editor']">管理员或编辑员功能</el-button>
```

### 2. 在组合式函数中使用

```typescript
import { usePermission } from '@/composables/usePermission'

const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, isSuperAdmin } =
  usePermission()

// 检查单个权限
if (hasPermission('content:article:create')) {
  // 执行创建操作
}

// 检查多个权限（任意一个）
if (hasAnyPermission(['content:article:edit', 'content:article:delete'])) {
  // 显示操作按钮
}

// 检查多个权限（全部）
if (hasAllPermissions(['content:article:edit', 'content:article:publish'])) {
  // 执行编辑并发布
}

// 检查角色
if (hasRole('admin')) {
  // 管理员功能
}

// 检查是否超级管理员
if (isSuperAdmin.value) {
  // 超级管理员功能
}
```

### 3. 在路由配置中使用

```typescript
{
  path: '/system/user',
  component: () => import('@/views/system/user/index.vue'),
  meta: {
    title: '用户管理',
    // 需要管理员角色
    roles: ['admin', 'super_admin'],
    // 需要用户列表权限
    permissions: ['system:user:list'],
  },
}
```

### 4. 在工具函数中使用

```typescript
import { checkPermission, checkRole, canAccessRoute } from '@/utils/permission'

// 检查权限
if (checkPermission('content:article:create')) {
  // 执行操作
}

// 检查角色
if (checkRole('admin')) {
  // 管理员功能
}

// 检查路由访问权限
if (canAccessRoute(route)) {
  // 可以访问该路由
}
```

## 动态路由加载

系统会根据用户的角色和权限动态加载可访问的路由：

1. 用户登录后，系统获取用户信息（包含角色和权限）
2. 根据角色和权限过滤异步路由配置
3. 动态添加用户可访问的路由到路由表
4. 超级管理员和管理员自动获取所有路由访问权限

## 扩展权限

如需添加新的权限：

1. 在 `src/config/rolePermissions.ts` 中的 `PermissionCodes` 添加新权限代码
2. 在 `RolePermissionsConfig` 中为相应角色分配新权限
3. 在路由配置中使用新权限进行访问控制
4. 在组件中使用指令或函数进行权限检查

## 注意事项

1. **权限代码命名规范**: 使用 `模块:资源:操作` 三段式格式
2. **超级管理员**: `*:*:*` 代表所有权限，无需单独配置每个权限
3. **角色继承**: 系统不支持角色继承，每个角色需要显式配置所有权限
4. **权限粒度**: 根据实际需求选择合适的权限粒度，不宜过细也不宜过粗
5. **测试账号**: 仅用于开发测试，生产环境应使用真实的用户认证系统
