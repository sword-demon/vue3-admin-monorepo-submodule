<template>
  <div class="page-container">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="分类名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入分类名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <template #icon>
              <Icon icon="ep:search" />
            </template>
            查询
          </el-button>
          <el-button @click="handleReset">
            <template #icon>
              <Icon icon="ep:refresh" />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="mb-4">
        <el-button v-permission="'content:category:create'" type="primary" @click="handleCreate">
          <template #icon>
            <Icon icon="ep:plus" />
          </template>
          新增分类
        </el-button>

        <el-button
          v-permission="'content:category:delete'"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          <template #icon>
            <Icon icon="ep:delete" />
          </template>
          批量删除
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="categoryList"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column prop="id" label="ID" width="80" align="center" />

        <el-table-column prop="name" label="分类名称" min-width="150" show-overflow-tooltip />

        <el-table-column prop="slug" label="URL标识" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.slug }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />

        <el-table-column prop="articleCount" label="文章数量" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="primary" size="small">{{ row.articleCount }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sort" label="排序" width="120" align="center">
          <template #default="{ row }">
            <el-input-number
              v-model="row.sort"
              :min="0"
              :max="999"
              size="small"
              controls-position="right"
              style="width: 100px"
              @change="handleSortChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ row.createdAt }}
          </template>
        </el-table-column>

        <el-table-column prop="updatedAt" label="更新时间" width="180" align="center">
          <template #default="{ row }">
            {{ row.updatedAt }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-permission="'content:category:edit'"
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>

            <el-button
              v-permission="'content:category:delete'"
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
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
        @size-change="fetchCategoryList"
        @current-change="fetchCategoryList"
      />
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入分类名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="URL标识" prop="slug">
          <el-input
            v-model="formData.slug"
            placeholder="请输入URL友好的标识(如: tech)"
            maxlength="50"
          />
          <div class="text-xs text-gray-500 mt-1">用于生成分类URL,只能包含字母、数字、连字符</div>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            :max="999"
            placeholder="请输入排序值"
            style="width: 100%"
          />
          <div class="text-xs text-gray-500 mt-1">数值越小排序越靠前</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Icon } from '@iconify/vue'
import * as contentApi from '@/api/content'
import type {
  Category,
  CategoryListParams,
  CategoryCreateParams,
  CategoryUpdateParams,
} from '@/types/content'

// 状态
const loading = ref(false)
const submitLoading = ref(false)
const categoryList = ref<Category[]>([])
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive<Partial<CategoryListParams>>({
  name: '',
  page: 1,
  pageSize: 10,
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<Partial<CategoryCreateParams & { id?: number }>>({
  name: '',
  slug: '',
  description: '',
  sort: 0,
})

// 对话框标题
const dialogTitle = computed(() => (isEdit.value ? '编辑分类' : '新增分类'))

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  slug: [
    { required: true, message: '请输入分类标识', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和连字符', trigger: 'blur' },
  ],
  description: [{ max: 200, message: '描述不能超过 200 个字符', trigger: 'blur' }],
  sort: [
    {
      required: true,
      type: 'number',
      min: 0,
      max: 999,
      message: '排序值必须在 0 到 999 之间',
      trigger: 'blur',
    },
  ],
}

/**
 * 获取分类列表
 */
const fetchCategoryList = async () => {
  loading.value = true
  try {
    const params: CategoryListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      name: searchForm.name,
    }

    const result = await contentApi.getCategoryList(params)
    categoryList.value = result.list
    pagination.total = result.total
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  pagination.page = 1
  fetchCategoryList()
}

/**
 * 重置搜索
 */
const handleReset = () => {
  searchForm.name = ''
  handleSearch()
}

/**
 * 选择变化
 */
const handleSelectionChange = (selection: Category[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

/**
 * 新增
 */
const handleCreate = () => {
  isEdit.value = false
  dialogVisible.value = true
  resetForm()
}

/**
 * 编辑
 */
const handleEdit = async (row: Category) => {
  isEdit.value = true
  dialogVisible.value = true

  try {
    const category = await contentApi.getCategory(row.id)
    Object.assign(formData, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      sort: category.sort,
    })
  } catch (error) {
    ElMessage.error('获取分类详情失败')
  }
}

/**
 * 删除
 */
const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(`确定要删除分类 "${row.name}" 吗?`, '提示', {
      type: 'warning',
    })

    await contentApi.deleteCategory(row.id)
    ElMessage.success('删除成功')
    fetchCategoryList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 批量删除
 */
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个分类吗?`, '提示', {
      type: 'warning',
    })

    // 模拟批量删除（实际项目中应该实现批量删除API）
    const deletePromises = selectedIds.value.map((id) => contentApi.deleteCategory(id))
    await Promise.all(deletePromises)

    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchCategoryList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 排序变更
 */
const handleSortChange = async (row: Category) => {
  try {
    await contentApi.updateCategory({
      id: row.id,
      sort: row.sort,
    } as CategoryUpdateParams)
    ElMessage.success('排序更新成功')
    // 重新获取列表以反映新的排序
    fetchCategoryList()
  } catch (error) {
    ElMessage.error('排序更新失败')
    // 恢复原排序值
    fetchCategoryList()
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

    if (isEdit.value) {
      // 更新
      await contentApi.updateCategory({
        id: formData.id!,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        sort: formData.sort,
      } as CategoryUpdateParams)
      ElMessage.success('更新成功')
    } else {
      // 创建
      await contentApi.createCategory(formData as CategoryCreateParams)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchCategoryList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    }
  } finally {
    submitLoading.value = false
  }
}

/**
 * 重置表单
 */
const resetForm = () => {
  formData.id = undefined
  formData.name = ''
  formData.slug = ''
  formData.description = ''
  formData.sort = 0

  formRef.value?.resetFields()
}

// 初始化
onMounted(() => {
  fetchCategoryList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}
</style>
