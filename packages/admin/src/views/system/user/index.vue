<template>
  <div class="page-container">
    <el-card shadow="never">
      <!-- 搜索区域 -->
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input
            v-model="searchForm.realName"
            placeholder="请输入真实姓名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="UserStatus.ENABLED" />
            <el-option label="禁用" :value="UserStatus.DISABLED" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.roleId" placeholder="请选择角色" clearable>
            <el-option
              v-for="role in allRoles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-input
            v-model="searchForm.department"
            placeholder="请输入部门"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮区域 -->
      <div class="mb-4">
        <el-button
          v-permission="'system:user:create'"
          type="primary"
          :icon="Plus"
          @click="handleCreate"
        >
          新增用户
        </el-button>
        <el-button
          v-permission="'system:user:delete'"
          type="danger"
          :icon="Delete"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </div>

      <!-- 用户列表表格 -->
      <el-table
        v-loading="loading"
        :data="userList"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="realName" label="真实姓名" min-width="120" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="40" />
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column label="性别" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.gender === UserGender.MALE" type="primary" size="small"> 男 </el-tag>
            <el-tag v-else-if="row.gender === UserGender.FEMALE" type="danger" size="small">
              女
            </el-tag>
            <el-tag v-else type="info" size="small">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              v-permission="'system:user:edit'"
              :active-value="UserStatus.ENABLED"
              :inactive-value="UserStatus.DISABLED"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="150">
          <template #default="{ row }">
            <el-tag v-for="role in row.roles" :key="role" size="small" class="mr-1">
              {{ getRoleName(role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" min-width="120" />
        <el-table-column prop="lastLoginTime" label="最后登录" width="160" />
        <el-table-column label="操作" min-width="220" fixed="right">
          <template #default="{ row }">
            <el-space :size="4" wrap>
              <el-button
                v-permission="'system:user:edit'"
                type="primary"
                text
                :icon="Edit"
                size="small"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="'system:user:edit'"
                type="warning"
                text
                :icon="Key"
                size="small"
                @click="handleResetPassword(row)"
              >
                重置密码
              </el-button>
              <el-button
                v-permission="'system:user:delete'"
                type="danger"
                text
                :icon="Delete"
                size="small"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="USER_FORM_RULES" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
            :http-request="handleUpload"
          >
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar-preview" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <div class="upload-tip">支持 jpg、png、gif 格式,大小不超过 2MB</div>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio :label="UserGender.MALE">男</el-radio>
            <el-radio :label="UserGender.FEMALE">女</el-radio>
            <el-radio :label="UserGender.UNKNOWN">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="UserStatus.ENABLED">启用</el-radio>
            <el-radio :label="UserStatus.DISABLED">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="formData.roleIds"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="role in allRoles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </el-button>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog v-model="passwordDialogVisible" title="重置密码" width="400px">
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="PASSWORD_FORM_RULES"
        label-width="80px"
      >
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="passwordForm.password"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handlePasswordSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete, Key } from '@element-plus/icons-vue'
import * as systemApi from '@/api/system'
import type {
  User,
  Role,
  UserListParams,
  UserCreateParams,
  UserUpdateParams,
  UserPasswordParams,
} from '@/types/system'
import { UserStatus, UserGender } from '@/types/system'

// 搜索表单
const searchForm = reactive<Partial<UserListParams>>({
  username: '',
  realName: '',
  status: undefined,
  roleId: undefined,
  department: '',
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 列表数据
const loading = ref(false)
const userList = ref<User[]>([])
const allRoles = ref<Role[]>([])
const selectedIds = ref<number[]>([])

// 对话框
const dialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)

// 表单
const formRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const defaultFormData: Partial<UserCreateParams> = {
  username: '',
  password: '',
  realName: '',
  email: '',
  phone: '',
  avatar: '',
  gender: UserGender.UNKNOWN,
  status: UserStatus.ENABLED,
  roleIds: [],
  department: '',
  remark: '',
}

const formData = reactive<Partial<UserCreateParams & { id?: number }>>({ ...defaultFormData })

const passwordForm = reactive<UserPasswordParams>({
  id: 0,
  password: '',
})

// 表单验证规则(常量 - 性能优化,避免响应式开销)
const USER_FORM_RULES: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 邮箱和手机号至少填一个
        if (!value && !formData.email) {
          callback(new Error('邮箱和手机号至少填写一个'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const PASSWORD_FORM_RULES: FormRules = {
  password: [
    { required: true, min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}

// 计算属性
const dialogTitle = computed(() => (isEdit.value ? '编辑用户' : '新增用户'))

// 角色Code到Name的映射(性能优化 - 避免在v-for中使用find)
const roleCodeMap = computed(() => {
  const map = new Map<string, string>()
  allRoles.value.forEach((role) => {
    map.set(role.code, role.name)
  })
  return map
})

// 获取角色名称(使用Map查找,O(1)复杂度)
const getRoleName = (roleCode: string) => {
  return roleCodeMap.value.get(roleCode) || roleCode
}

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const params: UserListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
    }
    const result = await systemApi.getUserList(params)
    userList.value = result.list
    pagination.total = result.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取所有角色
const fetchAllRoles = async () => {
  try {
    allRoles.value = await systemApi.getAllRoles()
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchUserList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    realName: '',
    status: undefined,
    roleId: undefined,
    department: '',
  })
  handleSearch()
}

// 分页变化
const handleSizeChange = () => {
  fetchUserList()
}

const handlePageChange = () => {
  fetchUserList()
}

// 选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

/**
 * 处理用户状态变化(启用/禁用切换)
 *
 * 逻辑说明:
 * 1. 通过el-switch组件直接修改row.status实现UI即时响应
 * 2. 调用API更新后端状态
 * 3. 如果API调用失败,恢复switch到原状态以保持UI与后端一致
 *
 * 遵循防御性编程 - 失败时回滚UI状态,避免UI与后端数据不一致
 */
const handleStatusChange = async (row: User) => {
  try {
    await systemApi.updateUser({
      id: row.id,
      status: row.status,
    })
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败')
    // 恢复原状态 - API调用失败时回滚UI,避免前后端状态不一致
    row.status = row.status === UserStatus.ENABLED ? UserStatus.DISABLED : UserStatus.ENABLED
  }
}

// 新增用户
const handleCreate = () => {
  isEdit.value = false
  dialogVisible.value = true
  Object.assign(formData, defaultFormData)
}

/**
 * 编辑用户
 *
 * 逻辑说明:
 * 1. 打开编辑对话框前,先调用getUser API获取用户完整详情
 * 2. 列表数据可能不包含所有字段(如remark等),需要从API获取完整数据
 * 3. 将API返回的数据填充到formData,供表单编辑使用
 *
 * 设计原因:
 * - 列表接口只返回必要字段以提高性能
 * - 编辑时需要完整数据,因此单独调用详情接口
 * - 遵循数据最小化原则 - 按需加载数据
 */
const handleEdit = async (row: User) => {
  isEdit.value = true
  dialogVisible.value = true
  try {
    const user = await systemApi.getUser(row.id)
    Object.assign(formData, {
      id: user.id,
      username: user.username,
      realName: user.realName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      gender: user.gender,
      status: user.status,
      roleIds: user.roleIds,
      department: user.department,
      remark: user.remark,
    })
  } catch (error) {
    ElMessage.error('获取用户详情失败')
  }
}

// 删除用户
const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 ${row.realName} 吗?`, '提示', {
      type: 'warning',
    })
    await systemApi.deleteUser(row.id)
    ElMessage.success('删除成功')
    fetchUserList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个用户吗?`, '提示', {
      type: 'warning',
    })
    await systemApi.batchDeleteUsers(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchUserList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 上传前验证
 * 检查文件格式和大小
 */
const handleBeforeUpload = (file: File) => {
  const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传 jpg、png、gif 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

/**
 * 自定义上传逻辑
 * 将图片转换为 base64 存储(实际项目中应上传到服务器)
 */
const handleUpload = (options: any) => {
  const file = options.file
  const reader = new FileReader()

  reader.onload = (e) => {
    formData.avatar = e.target?.result as string
    ElMessage.success('头像上传成功')
  }

  reader.onerror = () => {
    ElMessage.error('头像上传失败')
  }

  reader.readAsDataURL(file)
}

// 重置密码
const handleResetPassword = (row: User) => {
  passwordDialogVisible.value = true
  passwordForm.id = row.id
  passwordForm.password = ''
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, defaultFormData)
}

/**
 * 提交表单(新增或编辑用户)
 *
 * 执行流程:
 * 1. 表单验证 - 使用Element Plus的validate方法验证所有必填字段和格式
 * 2. 根据isEdit标识判断是创建还是更新操作
 * 3. 调用对应的API(createUser或updateUser)
 * 4. 成功后关闭对话框并刷新列表
 * 5. 失败时显示错误提示,保持对话框打开供用户修改
 *
 * 状态管理:
 * - submitLoading: 提交按钮的loading状态,防止重复提交
 * - finally块确保loading状态必定被重置,遵循防御性编程
 *
 * 遵循KISS原则 - 使用标准的validate模式,逻辑清晰易维护
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (isEdit.value) {
        // 编辑
        await systemApi.updateUser(formData as UserUpdateParams)
        ElMessage.success('更新成功')
      } else {
        // 新增
        await systemApi.createUser(formData as UserCreateParams)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      fetchUserList()
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 提交密码
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      await systemApi.updateUserPassword(passwordForm)
      ElMessage.success('密码重置成功')
      passwordDialogVisible.value = false
    } catch (error) {
      ElMessage.error('密码重置失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 初始化
onMounted(() => {
  fetchAllRoles()
  fetchUserList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

// 头像上传样式
.avatar-uploader {
  :deep(.el-upload) {
    position: relative;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.avatar-uploader-icon {
  width: 120px;
  height: 120px;
  color: var(--el-text-color-secondary);
  font-size: 28px;
  line-height: 120px;
  text-align: center;
}

.avatar-preview {
  display: block;
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.upload-tip {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-top: 8px;
}
</style>
