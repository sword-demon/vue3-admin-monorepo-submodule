<template>
  <div class="page-container">
    <el-row :gutter="20">
      <!-- 左侧用户信息卡片 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="6">
        <el-card shadow="never" class="user-card">
          <div class="user-info-wrapper">
            <div class="avatar-wrapper">
              <el-avatar :size="120" :src="userInfo.avatar">
                <i class="i-ep-user text-4xl" />
              </el-avatar>
              <el-button
                type="primary"
                circle
                size="small"
                class="avatar-edit-btn"
                @click="handleAvatarUpload"
              >
                <template #icon>
                  <i class="i-ep-edit" />
                </template>
              </el-button>
            </div>

            <h3 class="username">{{ userInfo.realName }}

</h3>
            <p class="user-role">{{ userInfo.roles?.join(' / ') || '暂无角色' }}

</p>

            <div class="user-stats">
              <div class="stat-item">
                <div class="stat-value">{{ userInfo.articleCount || 0 }}

</div>
                <div class="stat-label">文章数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userInfo.followCount || 0 }}

</div>
                <div class="stat-label">关注</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userInfo.fansCount || 0 }}

</div>
                <div class="stat-label">粉丝</div>
              </div>
            </div>

            <el-divider />

            <div class="user-details">
              <div class="detail-item">
                <i class="i-ep-user text-gray-500" />
                <span class="detail-label">用户名:</span>
                <span class="detail-value">{{ userInfo.username }}

</span>
              </div>
              <div class="detail-item">
                <i class="i-ep-message text-gray-500" />
                <span class="detail-label">邮箱:</span>
                <span class="detail-value">{{ userInfo.email }}

</span>
              </div>
              <div class="detail-item">
                <i class="i-ep-phone text-gray-500" />
                <span class="detail-label">手机:</span>
                <span class="detail-value">{{ userInfo.phone }}

</span>
              </div>
              <div class="detail-item">
                <i class="i-ep-office-building text-gray-500" />
                <span class="detail-label">部门:</span>
                <span class="detail-value">{{ userInfo.department }}

</span>
              </div>
              <div class="detail-item">
                <i class="i-ep-calendar text-gray-500" />
                <span class="detail-label">加入时间:</span>
                <span class="detail-value">{{
                  userInfo.createdAt?.split(' ')[0]
                }}

</span>
              </div>
              <div v-if="userInfo.lastLoginTime" class="detail-item">
                <i class="i-ep-clock text-gray-500" />
                <span class="detail-label">最近登录:</span>
                <span class="detail-value">{{ userInfo.lastLoginTime }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧内容区域 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="18">
        <el-tabs v-model="activeTab" class="profile-tabs">
          <!-- 基本资料 -->
          <el-tab-pane label="基本资料" name="basic">
            <el-card shadow="never">
              <el-form
                ref="basicFormRef"
                :model="basicForm"
                :rules="basicFormRules"
                label-width="100px"
              >
                <el-form-item label="真实姓名" prop="realName">
                  <el-input
                    v-model="basicForm.realName"
                    placeholder="请输入真实姓名"
                  />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="basicForm.email" placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="basicForm.phone" placeholder="请输入手机号" />
                </el-form-item>

                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="basicForm.gender">
                    <el-radio :value="UserGender.UNKNOWN">保密</el-radio>
                    <el-radio :value="UserGender.MALE">男</el-radio>
                    <el-radio :value="UserGender.FEMALE">女</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="个人简介" prop="remark">
                  <el-input
                    v-model="basicForm.remark"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入个人简介"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="basicFormLoading"
                    @click="handleBasicFormSubmit"
                  >
                    保存修改
                  </el-button>
                  <el-button @click="handleBasicFormReset">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-tab-pane>

          <!-- 修改密码 -->
          <el-tab-pane label="修改密码" name="password">
            <el-card shadow="never">
              <el-alert
                type="warning"
                :closable="false"
                class="mb-4"
                show-icon
              >
                <template #title>
                  密码强度要求:至少8位,包含大小写字母、数字和特殊字符
                </template>
              </el-alert>

              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordFormRules"
                label-width="100px"
              >
                <el-form-item label="当前密码" prop="oldPassword">
                  <el-input
                    v-model="passwordForm.oldPassword"
                    type="password"
                    placeholder="请输入当前密码"
                    show-password
                  />
                </el-form-item>

                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    show-password
                  />
                </el-form-item>

                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    show-password
                  />
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="passwordFormLoading"
                    @click="handlePasswordFormSubmit"
                  >
                    修改密码
                  </el-button>
                  <el-button @click="handlePasswordFormReset">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-tab-pane>

          <!-- 账户设置 -->
          <el-tab-pane label="账户设置" name="settings">
            <el-card shadow="never">
              <div class="settings-section">
                <h4 class="section-title">通知设置</h4>
                <el-form label-width="150px">
                  <el-form-item label="邮件通知">
                    <el-switch v-model="settings.emailNotification" />
                    <span class="text-sm text-gray-500 ml-2"
                      >接收系统重要通知邮件</span
                    >
                  </el-form-item>
                  <el-form-item label="站内消息">
                    <el-switch v-model="settings.siteNotification" />
                    <span class="text-sm text-gray-500 ml-2"
                      >接收站内消息通知</span
                    >
                  </el-form-item>
                  <el-form-item label="评论通知">
                    <el-switch v-model="settings.commentNotification" />
                    <span class="text-sm text-gray-500 ml-2"
                      >有人评论我的内容时通知我</span
                    >
                  </el-form-item>
                </el-form>
              </div>

              <el-divider />

              <div class="settings-section">
                <h4 class="section-title">隐私设置</h4>
                <el-form label-width="150px">
                  <el-form-item label="公开资料">
                    <el-switch v-model="settings.publicProfile" />
                    <span class="text-sm text-gray-500 ml-2"
                      >允许其他用户查看我的资料</span
                    >
                  </el-form-item>
                  <el-form-item label="显示在线状态">
                    <el-switch v-model="settings.showOnlineStatus" />
                    <span class="text-sm text-gray-500 ml-2"
                      >向其他用户显示我的在线状态</span
                    >
                  </el-form-item>
                </el-form>
              </div>

              <el-divider />

              <div class="settings-section">
                <h4 class="section-title">显示设置</h4>
                <el-form label-width="150px">
                  <el-form-item label="界面语言">
                    <el-select v-model="settings.language" style="width: 200px">
                      <el-option label="简体中文" value="zh-CN" />
                      <el-option label="English" value="en-US" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>

              <div class="mt-4">
                <el-button
                  type="primary"
                  :loading="settingsLoading"
                  @click="handleSettingsSave"
                >
                  保存设置
                </el-button>
              </div>
            </el-card>
          </el-tab-pane>

          <!-- 活动记录 -->
          <el-tab-pane label="活动记录" name="activity">
            <el-card shadow="never">
              <el-tabs v-model="activityTab" class="activity-tabs">
                <el-tab-pane label="登录记录" name="login">
                  <el-table
                    v-loading="activityLoading"
                    :data="loginRecords"
                    stripe
                  >
                    <el-table-column
                      prop="loginTime"
                      label="登录时间"
                      width="180"
                    />
                    <el-table-column prop="ip" label="IP地址" width="150" />
                    <el-table-column prop="location" label="登录地点" />
                    <el-table-column prop="device" label="设备" />
                    <el-table-column label="状态" width="100" align="center">
                      <template #default="{ row }">
                        <el-tag
                          :type="row.status === 'success' ? 'success' : 'danger'"
                        >
                          {{ row.status === 'success' ? '成功' : '失败' }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>

                  <el-pagination
                    v-model:current-page="loginPagination.page"
                    v-model:page-size="loginPagination.pageSize"
                    :total="loginPagination.total"
                    :page-sizes="[10, 20, 50]"
                    layout="total, sizes, prev, pager, next"
                    class="mt-4 justify-end"
                    @size-change="fetchLoginRecords"
                    @current-change="fetchLoginRecords"
                  />
                </el-tab-pane>

                <el-tab-pane label="操作日志" name="operation">
                  <el-table
                    v-loading="activityLoading"
                    :data="operationLogs"
                    stripe
                  >
                    <el-table-column
                      prop="operationTime"
                      label="操作时间"
                      width="180"
                    />
                    <el-table-column prop="module" label="模块" width="120" />
                    <el-table-column prop="action" label="操作" width="120" />
                    <el-table-column
                      prop="description"
                      label="描述"
                      show-overflow-tooltip
                    />
                    <el-table-column label="状态" width="100" align="center">
                      <template #default="{ row }">
                        <el-tag
                          :type="row.status === 'success' ? 'success' : 'danger'"
                        >
                          {{ row.status === 'success' ? '成功' : '失败' }}

                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>

                  <el-pagination
                    v-model:current-page="operationPagination.page"
                    v-model:page-size="operationPagination.pageSize"
                    :total="operationPagination.total"
                    :page-sizes="[10, 20, 50]"
                    layout="total, sizes, prev, pager, next"
                    class="mt-4 justify-end"
                    @size-change="fetchOperationLogs"
                    @current-change="fetchOperationLogs"
                  />
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- 头像上传对话框 -->
    <el-dialog
      v-model="avatarDialogVisible"
      title="上传头像"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleAvatarChange"
        accept="image/*"
      >
        <img v-if="avatarPreview" :src="avatarPreview" class="avatar-preview" />
        <div v-else class="avatar-uploader-icon">
          <i class="i-ep-plus text-4xl" />
          <div class="text-sm text-gray-500 mt-2">点击上传图片</div>
        </div>
      </el-upload>

      <template #footer>
        <el-button @click="avatarDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="avatarUploading"
          @click="handleAvatarSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted }

 from 'vue'
import { ElMessage, type FormInstance, type FormRules, type UploadFile }

 from 'element-plus'
import type { User }

 from '@/types/system'
import { UserGender } from '@/types/system'

// ========== 用户信息 ==========
interface UserInfoExtended extends User {
  articleCount?: number;
  followCount?: number;
  fansCount?: number
}

const userInfo = ref<UserInfoExtended>({
  id: 1,
  username: 'admin',
  realName: '系统管理员',
  email: 'admin@example.com',
  phone: '13800138000',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  gender: UserGender.MALE,
  status: 1,
  roleIds: [1],
  roles: ['超级管理员'],
  department: '技术部',
  remark: '这是一段个人简介,介绍自己的工作和兴趣。',
  lastLoginTime: '2024-03-20 15:30:00',
  createdAt: '2024-01-01 00:00:00',
  updatedAt: '2024-03-20 15:30:00',
  articleCount: 128,
  followCount: 256,
  fansCount: 512,
})

// ========== Tab 切换 ==========
const activeTab = ref('basic')
const activityTab = ref('login')

// ========== 基本资料表单 ==========
const basicFormRef = ref<FormInstance>()
const basicFormLoading = ref(false)
const basicForm = reactive({
  realName: '',
  email: '',
  phone: '',
  gender: UserGender.UNKNOWN,
  remark: '',
})

const basicFormRules: FormRules = {
  realName: [
    {; min: 2,; max: 20,;
  email: [
    {; type: 'email',;
  phone: [
    {; required: true,;
      pattern: /^1[3-9]\d{9}$/,;
      message: '请输入正确的手机号格式',;
      trigger: 'blur',
    },
  ],
}

/**
 * 保存基本资料
 */
const handlebasicformsubmit = async () => {
  if (!basicFormRef.value) return

  try {
    await basicFormRef.value.validate()

    basicFormLoading.value = true

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 更新用户信息
    Object.assign(userInfo.value, basicForm)

    ElMessage.success('基本资料保存成功')
  }

 catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('基本资料保存失败')
    }
  }

 finally {
    basicFormLoading.value = false
  }
}

/**
 * 重置基本资料表单
 */
const handlebasicformreset = () => {
  loadBasicFormData()
  basicFormRef.value?.clearValidate()
}

/**
 * 加载基本资料数据
 */
const loadbasicformdata = () => {
  basicForm.realName = userInfo.value.realName
  basicForm.email = userInfo.value.email
  basicForm.phone = userInfo.value.phone
  basicForm.gender = userInfo.value.gender
  basicForm.remark = userInfo.value.remark || ''
}

// ========== 修改密码表单 ==========
const passwordFormRef = ref<FormInstance>()
const passwordFormLoading = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  }

 else {
    callback()
  }
}

const passwordFormRules: FormRules = {
  oldPassword: [{;
  newPassword: [
    {; min: 8,;
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,;
  confirmPassword: [
    {; required: true,; message: '请再次输入新密码',; validator: validateconfirmpassword,; trigger: 'blur' },
  ],
}

/**
 * 修改密码
 */
const handlepasswordformsubmit = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()

    passwordFormLoading.value = true

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 800))

    ElMessage.success('密码修改成功,请重新登录')

    // 清空表单
    handlePasswordFormReset()
  }

 catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('密码修改失败')
    }
  }

 finally {
    passwordFormLoading.value = false
  }
}

/**
 * 重置密码表单
 */
const handlepasswordformreset = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.clearValidate()
}

// ========== 账户设置 ==========
const settingsLoading = ref(false)
const settings = reactive({
  emailNotification: true,
  siteNotification: true,
  commentNotification: true,
  publicProfile: true,
  showOnlineStatus: true,
  language: 'zh-CN',
})

/**
 * 保存设置
 */
const handleSettingsSave = async () => {
  try {
    settingsLoading.value = true

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    ElMessage.success('设置保存成功')
  } catch (error) {
    ElMessage.error('设置保存失败')
  }

 finally {
    settingsLoading.value = false
  }
}

// ========== 头像上传 ==========
const avatarDialogVisible = ref(false)
const avatarPreview = ref('')
const avatarFile = ref<File | null>(null)
const avatarUploading = ref(false)

/**
 * 打开头像上传对话框
 */
const handleAvatarUpload = () => {
  avatarDialogVisible.value = true
  avatarPreview.value = userInfo.value.avatar
}

/**
 * 头像选择变化
 */
const handleavatarchange = (file: UploadFile) => {
  if (file.raw) {
    avatarFile.value = file.raw
    avatarPreview.value = URL.createObjectURL(file.raw)
  }
}

/**
 * 提交头像
 */
const handleavatarsubmit = async () => {
  if (!avatarFile.value) {
    ElMessage.warning('请选择图片')
    return
  }

  try {
    avatarUploading.value = true

    // 模拟上传
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 更新用户头像
    userInfo.value.avatar = avatarPreview.value

    ElMessage.success('头像上传成功')
    avatarDialogVisible.value = false
  } catch (error) {
    ElMessage.error('头像上传失败')
  }

 finally {
    avatarUploading.value = false
  }
}

// ========== 活动记录 ==========
interface LoginRecord {
  id: number;
  loginTime: string;
  ip: string;
  location: string;
  device: string;
  status: 'success' | 'failed'
}

interface operationlog {
  id: number;
  operationTime: string;
  module: string;
  action: string;
  description: string;
  status: 'success' | 'failed'
}

const activityLoading = ref(false)
const loginRecords = ref<LoginRecord[]>([])
const operationLogs = ref<OperationLog[]>([])

const loginPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const operationPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

/**
 * 获取登录记录
 */
const fetchLoginRecords = async () => {
  activityloading.value = true
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟数据
    const mockData: loginrecord[] = [
      {;
        status: 'success',
      },
      {;
        id: 6,;
        loginTime: '2024-03-18 16:00:00',;
        ip: '123.45.67.89',;
        location: '上海市 浦东新区',;
        device: 'Firefox 123 / Windows 11',;
        status: 'failed',
      },
    ]

    loginrecords.value = mockdata
    loginpagination.total = mockdata.length
  } catch (error) {
    ElMessage.error('获取登录记录失败')
  }

 finally {
    activityLoading.value = false
  }
}

/**
 * 获取操作日志
 */
const fetchoperationlogs = async () => {
  activityloading.value = true
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟数据
    const mockData: operationlog[] = [
      {;
        status: 'success',
      },
      {;
        id: 5,;
        operationTime: '2024-03-19 16:30:00',;
        module: '系统设置',;
        action: '修改配置',;
        description: '修改系统邮件配置',;
        status: 'failed',
      },
    ]

    operationlogs.value = mockdata
    operationpagination.total = mockdata.length
  } catch (error) {
    ElMessage.error('获取操作日志失败')
  }

 finally {
    activityLoading.value = false
  }
}

// ========== 初始化 ==========
onMounted(() => {
  loadBasicFormData()
  fetchLoginRecords()
  fetchOperationLogs()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

// 用户信息卡片
.user-card {
  .user-info-wrapper {
    text-align: center;

    .avatar-wrapper {
      position: relative;
      display: inline-block;
      margin-bottom: 20px;

      .avatar-edit-btn {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }

    .username {
      margin: 10px 0;
      font-size: 24px;
      font-weight: bold;
    }

    .user-role {
      color: #909399;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .user-stats {
      display: flex;
      justify-content: space-around;
      padding: 20px 0;

      .stat-item {
        text-align: center;

        .stat-value {
          color: var(--el-color-primary);
          font-size: 24px;
          font-weight: bold;
        }

        .stat-label {
          color: #909399;
          font-size: 12px;
          margin-top: 5px;
        }
      }
    }

    .user-details {
      text-align: left;

      .detail-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        i {
          width: 20px;
          margin-right: 10px;
        }

        .detail-label {
          color: #909399;
          font-size: 14px;
          margin-right: 10px;
          min-width: 80px;
        }

        .detail-value {
          flex: 1;
          color: #303133;
          font-size: 14px;
        }
      }
    }
  }
}

// Tab样式
.profile-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }
}

.activity-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 15px;
  }
}

// 设置区域
.settings-section {
  .section-title {
    color: #303133;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}

// 头像上传
.avatar-uploader {
  text-align: center;

  .avatar-preview {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-uploader-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    border: 2px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

// 响应式处理
@media (max-width: 768px) {
  .user-card {
    margin-bottom: 20px;
  }
}
</style>
