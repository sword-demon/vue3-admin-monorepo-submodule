<template>
  <div class="page-container">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="报表名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入报表名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="报表类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择报表类型"
            clearable
            style="width: 150px"
          >
            <el-option label="销售报表" value="sales" />
            <el-option label="用户报表" value="user" />
            <el-option label="内容报表" value="content" />
            <el-option label="访问报表" value="visit" />
            <el-option label="财务报表" value="financial" />
          </el-select>
        </el-form-item>

        <el-form-item label="生成状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="生成中" value="generating" />
            <el-option label="已完成" value="completed" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <template #icon>
              <el-icon><Search /></el-icon>
            </template>
            查询
          </el-button>
          <el-button @click="handleReset">
            <template #icon>
              <el-icon><Refresh /></el-icon>
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="mb-4">
        <el-button type="primary" @click="handleGenerate">
          <template #icon>
            <el-icon><DocumentAdd /></el-icon>
          </template>
          生成报表
        </el-button>

        <el-button type="success" :disabled="selectedIds.length === 0" @click="handleBatchExport">
          <template #icon>
            <el-icon><Download /></el-icon>
          </template>
          批量导出
        </el-button>

        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          <template #icon>
            <el-icon><Delete /></el-icon>
          </template>
          批量删除
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="reportList"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column prop="id" label="ID" width="80" align="center" />

        <el-table-column prop="name" label="报表名称" min-width="200" show-overflow-tooltip />

        <el-table-column prop="type" label="报表类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getReportTypeTag(row.type)">
              {{ getReportTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="period" label="统计周期" width="180" align="center">
          <template #default="{ row }">
            <span class="text-sm text-gray-600">
              {{ row.startDate }}

              ~ {{ row.endDate }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="format" label="导出格式" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.format === 'excel' ? 'success' : 'warning'">
              {{ row.format.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="fileSize" label="文件大小" width="100" align="center">
          <template #default="{ row }">
            <span v-if="row.fileSize">{{ formatFileSize(row.fileSize) }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="creator" label="创建人" width="100" align="center" />

        <el-table-column prop="createdAt" label="创建时间" width="180" align="center" />

        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'completed'"
              type="primary"
              link
              size="small"
              @click="handlePreview(row)"
            >
              预览
            </el-button>

            <el-button
              v-if="row.status === 'completed'"
              type="success"
              link
              size="small"
              @click="handleDownload(row)"
            >
              下载
            </el-button>

            <el-button
              v-if="row.status === 'failed'"
              type="warning"
              link
              size="small"
              @click="handleRegenerate(row)"
            >
              重新生成
            </el-button>

            <el-button type="danger" link size="small" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="mt-4 justify-end"
        @size-change="fetchReportList"
        @current-change="fetchReportList"
      />
    </el-card>

    <!-- 生成报表对话框 -->
    <el-dialog v-model="dialogVisible" title="生成报表" width="600px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="报表名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入报表名称" />
        </el-form-item>

        <el-form-item label="报表类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择报表类型" style="width: 100%">
            <el-option label="销售报表" value="sales">
              <div class="flex items-center justify-between">
                <span>销售报表</span>
                <span class="text-xs text-gray-500">订单、营收统计</span>
              </div>
            </el-option>
            <el-option label="用户报表" value="user">
              <div class="flex items-center justify-between">
                <span>用户报表</span>
                <span class="text-xs text-gray-500">用户增长、活跃度</span>
              </div>
            </el-option>
            <el-option label="内容报表" value="content">
              <div class="flex items-center justify-between">
                <span>内容报表</span>
                <span class="text-xs text-gray-500">文章、评论统计</span>
              </div>
            </el-option>
            <el-option label="访问报表" value="visit">
              <div class="flex items-center justify-between">
                <span>访问报表</span>
                <span class="text-xs text-gray-500">PV、UV、跳出率</span>
              </div>
            </el-option>
            <el-option label="财务报表" value="financial">
              <div class="flex items-center justify-between">
                <span>财务报表</span>
                <span class="text-xs text-gray-500">收支、利润统计</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="统计周期" prop="dateRange">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="导出格式" prop="format">
          <el-radio-group v-model="formData.format">
            <el-radio value="excel">
              <el-icon class="text-green-500"><Document /></el-icon>
              Excel (.xlsx)
            </el-radio>
            <el-radio value="pdf">
              <el-icon class="text-red-500"><Document /></el-icon>
              PDF (.pdf)
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="包含数据" prop="includeData">
          <el-checkbox-group v-model="formData.includeData">
            <el-checkbox value="chart">图表</el-checkbox>
            <el-checkbox value="table">数据表格</el-checkbox>
            <el-checkbox value="summary">统计摘要</el-checkbox>
            <el-checkbox value="trend">趋势分析</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="说明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入报表说明(可选)"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          立即生成
        </el-button>
      </template>
    </el-dialog>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" title="报表预览" width="80%" top="5vh">
      <div class="preview-container">
        <div class="preview-header">
          <h3>{{ currentReport?.name }}</h3>
          <div class="preview-info">
            <span>类型: {{ getReportTypeName(currentReport?.type || '') }}</span>
            <span class="mx-3">|</span>
            <span
              >周期: {{ currentReport?.startDate }}

              ~ {{ currentReport?.endDate }}</span
            >
            <span class="mx-3">|</span>
            <span>生成时间: {{ currentReport?.createdAt }} </span>
          </div>
        </div>
        <div class="preview-content">
          <div class="text-center text-gray-500 py-10">
            <el-icon class="text-6xl mb-4"><Document /></el-icon>
            <p>报表预览功能</p>
            <p class="text-sm mt-2">实际项目中可以使用 iframe 或 PDF.js 展示报表内容</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, DocumentAdd, Download, Delete, Document } from '@element-plus/icons-vue'
import {
  getReportList,
  createReport,
  deleteReport,
  batchDeleteReports,
  regenerateReport,
  downloadReport,
  type Report,
  type ReportCreateParams,
} from '@/api/report'

// 状态
const loading = ref(false)
const submitLoading = ref(false)
const reportList = ref<Report[]>([])
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: '',
  dateRange: null as [Date, Date] | null,
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 对话框
const dialogVisible = ref(false)
const previewVisible = ref(false)
const formRef = ref<FormInstance>()
const currentReport = ref<Report | null>(null)

// 表单数据
const formData = reactive({
  name: '',
  type: '',
  dateRange: null as [Date, Date] | null,
  format: 'excel',
  includeData: ['chart', 'table', 'summary'],
  description: '',
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入报表名称', trigger: 'blur' },
    { min: 2, max: 50, message: '报表名称长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择报表类型', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择日期范围', trigger: 'change' }],
  format: [{ required: true, message: '请选择导出格式', trigger: 'change' }],
}

/**
 * 获取报表类型标签颜色
 */
const getReportTypeTag = (type: string): string => {
  const typeMap: Record<string, string> = {
    sales: 'success',
    user: 'primary',
    content: 'warning',
    visit: 'info',
    financial: 'danger',
  }
  return typeMap[type] || ''
}

/**
 * 获取报表类型名称
 */
const getReportTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    sales: '销售报表',
    user: '用户报表',
    content: '内容报表',
    visit: '访问报表',
    financial: '财务报表',
  }
  return typeMap[type] || type
}

/**
 * 获取状态类型
 */
const getStatusType = (status: string): string => {
  const statusMap: Record<string, string> = {
    generating: 'warning',
    completed: 'success',
    failed: 'danger',
  }
  return statusMap[status] || ''
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    generating: '生成中',
    completed: '已完成',
    failed: '失败',
  }
  return statusMap[status] || status
}

/**
 * 格式化文件大小
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024)
    return `${bytes}

 b`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(2)}

 kb`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * 获取报表列表
 */
const fetchReportList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      name: searchForm.name || undefined,
      type: searchForm.type || undefined,
      status: searchForm.status || undefined,
      dateRange: searchForm.dateRange
        ? [
            searchForm.dateRange[0].toISOString().slice(0, 10),
            searchForm.dateRange[1].toISOString().slice(0, 10),
          ]
        : undefined,
    }

    const response = await getReportList(params)
    reportList.value = response.list
    pagination.total = response.total
  } catch (error) {
    ElMessage.error('获取报表列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  pagination.page = 1
  fetchReportList()
}

/**
 * 重置搜索
 */
const handleReset = () => {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.status = ''
  searchForm.dateRange = null
  handleSearch()
}

/**
 * 选择变化
 */
const handleSelectionChange = (selection: Report[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

/**
 * 生成报表
 */
const handleGenerate = () => {
  dialogVisible.value = true
  resetForm()
}

/**
 * 预览
 */
const handlePreview = (row: Report) => {
  currentReport.value = row
  previewVisible.value = true
}

/**
 * 下载
 */
const handleDownload = async (row: Report) => {
  try {
    const downloadInfo = await downloadReport(row.id)
    // 创建下载链接
    const link = document.createElement('a')
    link.href = downloadInfo.data.downloadUrl
    link.download = downloadInfo.data.fileName
    link.click()
    ElMessage.success(`开始下载: ${row.name}`)
  } catch (error) {
    ElMessage.error('下载失败')
  }
}

/**
 * 重新生成
 */
const handleRegenerate = async (row: Report) => {
  try {
    await ElMessageBox.confirm(`确定要重新生成报表 "${row.name}" 吗?`, '提示', { type: 'warning' })

    await regenerateReport(row.id)
    ElMessage.success('已提交重新生成请求')
    fetchReportList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('重新生成失败')
    }
  }
}

/**
 * 删除
 */
const handleDelete = async (row: Report) => {
  try {
    await ElMessageBox.confirm(`确定要删除报表 "${row.name}" 吗?`, '提示', { type: 'warning' })

    await deleteReport(row.id)
    ElMessage.success('删除成功')
    fetchReportList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 批量导出
 */
const handleBatchExport = async () => {
  try {
    await ElMessageBox.confirm(`确定要导出选中的 ${selectedIds.value.length} 个报表吗?`, '提示', {
      type: 'info',
    })

    ElMessage.success('已添加到导出队列,请稍后在下载中心查看')
    selectedIds.value = []
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('导出失败')
    }
  }
}

/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个报表吗?`, '提示', {
      type: 'warning',
    })

    await batchDeleteReports(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchReportList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    submitLoading.value = true

    const submitData: ReportCreateParams = {
      name: formData.name,
      type: formData.type,
      dateRange: formData.dateRange!,
      format: formData.format,
      includeData: formData.includeData,
      description: formData.description,
    }

    await createReport(submitData)
    ElMessage.success('报表生成任务已提交,请稍后查看')
    dialogVisible.value = false
    fetchReportList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('生成失败')
    }
  } finally {
    submitLoading.value = false
  }
}

/**
 * 重置表单
 */
const resetForm = () => {
  formData.name = ''
  formData.type = ''
  formData.dateRange = null
  formData.format = 'excel'
  formData.includeData = ['chart', 'table', 'summary']
  formData.description = ''

  formRef.value?.resetFields()
}

// 初始化
onMounted(() => {
  fetchReportList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

// 预览容器
.preview-container {
  min-height: 400px;
}

.preview-header {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 20px;

  h3 {
    margin: 0 0 10px;
    color: #303133;
    font-size: 18px;
    font-weight: bold;
  }

  .preview-info {
    color: #606266;
    font-size: 14px;
  }
}

.preview-content {
  min-height: 300px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
}
</style>
