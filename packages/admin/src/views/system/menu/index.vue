<template>
  <div class="page-container">
    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="菜单名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入菜单名称"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择菜单类型"
            clearable
            style="width: 150px"
            @clear="handleSearch"
          >
            <el-option label="目录" :value="MenuType.DIRECTORY" />
            <el-option label="菜单" :value="MenuType.MENU" />
            <el-option label="按钮" :value="MenuType.BUTTON" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
            @clear="handleSearch"
          >
            <el-option label="启用" :value="MenuStatus.ENABLED" />
            <el-option label="禁用" :value="MenuStatus.DISABLED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">菜单列表</span>
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            新增菜单
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
      >
        <el-table-column prop="name" label="菜单名称" width="200" />
        <el-table-column prop="icon" label="图标" width="80" align="center">
          <template #default="{ row }">
            <SvgIcon v-if="row.icon" :icon="row.icon" :size="18" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === MenuType.DIRECTORY" type="info">目录</el-tag>
            <el-tag v-else-if="row.type === MenuType.MENU" type="success">菜单</el-tag>
            <el-tag v-else type="warning">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" min-width="150" />
        <el-table-column prop="component" label="组件路径" min-width="200" show-overflow-tooltip />
        <el-table-column prop="permissions" label="权限标识" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.permissions?.join(', ') || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="MenuStatus.ENABLED"
              :inactive-value="MenuStatus.DISABLED"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="hidden" label="可见" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.hidden ? 'danger' : 'success'">
              {{ row.hidden ? '隐藏' : '显示' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-space :size="4">
              <el-button type="primary" text :icon="Edit" size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="success" text :icon="Plus" size="small" @click="handleCreateChild(row)">
                新增
              </el-button>
              <el-button type="danger" text :icon="Delete" size="small" @click="handleDelete(row)">
                删除
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="menuTreeOptions"
            :props="{ label: 'name', value: 'id' }"
            check-strictly
            placeholder="请选择上级菜单"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :value="MenuType.DIRECTORY">目录</el-radio>
            <el-radio :value="MenuType.MENU">菜单</el-radio>
            <el-radio :value="MenuType.BUTTON">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item
          v-if="formData.type !== MenuType.BUTTON"
          label="菜单图标"
          prop="icon"
        >
          <el-input v-model="formData.icon" placeholder="请输入图标名称,如: ep:home-filled 或 carbon:menu">
            <template #prefix>
              <SvgIcon v-if="formData.icon" :icon="formData.icon" :size="18" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="formData.type !== MenuType.BUTTON"
          label="路由路径"
          prop="path"
        >
          <el-input v-model="formData.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item
          v-if="formData.type === MenuType.MENU"
          label="组件路径"
          prop="component"
        >
          <el-input v-model="formData.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item
          v-if="formData.type === MenuType.DIRECTORY"
          label="重定向"
          prop="redirect"
        >
          <el-input v-model="formData.redirect" placeholder="请输入重定向路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permissions">
          <el-select
            v-model="formData.permissions"
            multiple
            filterable
            allow-create
            placeholder="请输入权限标识,如: system:menu:list"
            style="width: 100%"
          >
            <el-option
              v-for="perm in commonPermissions"
              :key="perm"
              :label="perm"
              :value="perm"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="MenuStatus.ENABLED">启用</el-radio>
            <el-radio :value="MenuStatus.DISABLED">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-radio-group v-model="formData.hidden">
            <el-radio :value="false">显示</el-radio>
            <el-radio :value="true">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缓存页面" prop="keepAlive">
          <el-radio-group v-model="formData.keepAlive">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Search, Refresh, Plus, Edit, Delete }

 from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules }

 from 'element-plus'
import * as systemapi from '@/api/system'
import type {
  Menu,
  MenuListParams,
  MenuCreateParams,
  MenuUpdateParams,
}

 from '@/types/system'
import { MenuType, MenuStatus }

 from '@/types/system'
import { SvgIcon } from '@/components/common'

// 搜索表单
const searchForm = reactive<MenuListParams>({
  name: '',
  status: undefined,
  type: undefined,
})

// 菜单列表
const loading = ref(false)
const menuList = ref<Menu[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<MenuCreateParams | MenuUpdateParams>({
  id: undefined,
  parentId: 0,
  name: '',
  path: '',
  component: '',
  redirect: '',
  icon: '',
  type: MenuType.MENU,
  status: MenuStatus.ENABLED,
  sort: 0,
  permissions: [],
  hidden: false,
  keepAlive: true,
})

// 表单验证规则
const formRules: FormRules = {
  name: [{;
  type: [{; message: '请选择菜单类型',;
  path: [
    {;
      required: true,;
  component: [
    {;
      validator: (rule, value, callback) => {
        if (formData.type === MenuType.MENU && !value) {
          callback(new Error('请输入组件路径'))
        } else {
          callback()
        }
      },;
      trigger: 'blur',
    },
  ],
}

// 常用权限标识(用于下拉提示)
const commonPermissions = [
  'system:menu:list',
  'system:menu:create',
  'system:menu:edit',
  'system:menu:delete',
  'system:user:list',
  'system:user:create',
  'system:user:edit',
  'system:user:delete',
  'system:role:list',
  'system:role:create',
  'system:role:edit',
  'system:role:delete',
]

// 菜单树形选项(用于选择上级菜单)
const menuTreeOptions = computed(() => {
  const tree: any[] = [{ id: 0, name: '顶级菜单', children: [] }]

  // 递归构建树形结构,排除按钮类型和当前编辑的菜单及其子孙
  const buildTree = (menus: Menu[], editId?: number): any[] => {
    return menus
      .filter((menu) => {
        // 排除按钮类型
        if (menu.type === MenuType.BUTTON) return false
        // 排除当前编辑的菜单
        if (editId && menu.id === editId) return false
        return true
      })
      .map((menu) => ({
        id: menu.id,
        name: menu.name,
        children: menu.children ? buildTree(menu.children, editId) : [],
      }))
  }

  tree[0].children = buildTree(menuList.value, (formData as MenuUpdateParams).id)
  return tree
})

// 获取菜单列表
const fetchMenuList = async () => {
  loading.value = true
  try {
    const data = await systemApi.getMenuList(searchForm)
    menuList.value = data
  } catch (error) {
    ElMessage.error('获取菜单列表失败')
    console.error('获取菜单列表失败:', error)
  }

 finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  fetchMenuList()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.status = undefined
  searchForm.type = undefined
  fetchMenuList()
}

// 新增菜单
const handleCreate = () => {
  dialogTitle.value = '新增菜单'
  resetFormData()
  dialogVisible.value = true
}

// 新增子菜单
const handleCreateChild = (row: Menu) => {
  dialogTitle.value = '新增子菜单'
  resetFormData()
  formData.parentId = row.id
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row: Menu) => {
  dialogTitle.value = '编辑菜单'
  Object.assign(formData, {
    id: row.id,
    parentId: row.parentId,
    name: row.name,
    path: row.path,
    component: row.component || '',
    redirect: row.redirect || '',
    icon: row.icon || '',
    type: row.type,
    status: row.status,
    sort: row.sort,
    permissions: row.permissions || [],
    hidden: row.hidden,
    keepAlive: row.keepAlive,
  })
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = async (row: Menu) => {
  // 检查是否有子菜单
  if (row.children && row.children.length > 0) {
    ElMessage.warning('请先删除子菜单')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除菜单 "${row.name}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await systemApi.deleteMenu(row.id)
    ElMessage.success('删除成功')
    fetchMenuList()
  }

 catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除菜单失败:', error)
    }
  }
}

// 状态切换
const handleStatusChange = async (row: Menu) => {
  try {
    await systemApi.updateMenu({
      id: row.id,
      status: row.status,
    })
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败')
    // 恢复原状态
    row.status = row.status === MenuStatus.ENABLED ? MenuStatus.DISABLED : menustatus.enabledrow.statusrow.statusMenuStatus.ENABLEDMenuStatus.DISABLED
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitLoading.value = true

    if ((formData as MenuUpdateParams).id) {
      // 编辑
      await systemApi.updateMenu(formData as MenuUpdateParams)
      ElMessage.success('更新成功')
    }

 else {
      // 新增
      await systemApi.createMenu(formData as MenuCreateParams)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchMenuList()
  }

 catch (error: any) {
    if (error !== false) {
      // 不是验证失败
      ElMessage.error('操作失败')
      console.error('提交表单失败:', error)
    }
  }

 finally {
    submitLoading.value = false
  }
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
  resetFormData()
}

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    id: undefined,
    parentId: 0,
    name: '',
    path: '',
    component: '',
    redirect: '',
    icon: '',
    type: MenuType.MENU,
    status: MenuStatus.ENABLED,
    sort: 0,
    permissions: [],
    hidden: false,
    keepAlive: true,
  })
}

// 初始化
onMounted(() => {
  fetchMenuList()
})
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;
  max-width: 100%;
  padding: var(--app-padding-base);
  box-sizing: border-box;
}

.search-card {
  width: 100%;
  margin-bottom: var(--app-margin-base);
}

.table-card {
  width: 100%;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: var(--el-font-size-large);
      font-weight: 600;
    }
  }
}
</style>
