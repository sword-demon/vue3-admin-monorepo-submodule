<template>
  <div class="page-container">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="标题">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入文章标题"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="作者">
          <el-input
            v-model="searchForm.author"
            placeholder="请输入作者"
            clearable
            style="width: 150px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="分类">
          <el-select
            v-model="searchForm.categoryId"
            placeholder="请选择分类"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标签">
          <el-select
            v-model="searchForm.tagId"
            placeholder="请选择标签"
            clearable
            style="width: 150px"
          >
            <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="草稿" :value="ArticleStatus.DRAFT" />
            <el-option label="已发布" :value="ArticleStatus.PUBLISHED" />
            <el-option label="已归档" :value="ArticleStatus.ARCHIVED" />
          </el-select>
        </el-form-item>

        <el-form-item label="置顶">
          <el-select
            v-model="searchForm.isTop"
            placeholder="是否置顶"
            clearable
            style="width: 120px"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="推荐">
          <el-select
            v-model="searchForm.isRecommend"
            placeholder="是否推荐"
            clearable
            style="width: 120px"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 260px"
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
        <el-button v-permission="'content:article:create'" type="primary" @click="handleCreate">
          <template #icon>
            <Icon icon="ep:plus" />
          </template>
          新增文章
        </el-button>

        <el-button
          v-permission="'content:article:delete'"
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
        :data="articleList"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column prop="id" label="ID" width="80" align="center" />

        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <span>{{ row.title }}</span>
              <Icon v-if="row.isTop" icon="ep:top" color="#f56c6c" title="置顶" />
              <Icon v-if="row.isRecommend" icon="ep:star-filled" color="#409eff" title="推荐" />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="author" label="作者" width="120" />

        <el-table-column prop="categoryName" label="分类" width="120" />

        <el-table-column label="标签" width="200">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags"
              :key="tag.id"
              :style="getTagStyle(tag.color)"
              size="small"
              class="article-tag mr-1"
            >
              {{ tag.name }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === ArticleStatus.DRAFT" type="info"> 草稿 </el-tag>
            <el-tag v-else-if="row.status === ArticleStatus.PUBLISHED" type="success">
              已发布
            </el-tag>
            <el-tag v-else type="warning">已归档</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="统计" width="180" align="center">
          <template #default="{ row }">
            <div class="article-stats">
              <div class="stat-item">
                <View class="stat-icon view-icon" />
                <span class="stat-value">{{ formatNumber(row.viewCount) }} </span>
                <span class="stat-label">浏览</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <Star class="stat-icon like-icon" />
                <span class="stat-value">{{ formatNumber(row.likeCount) }} </span>
                <span class="stat-label">点赞</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <ChatLineRound class="stat-icon comment-icon" />
                <span class="stat-value">{{ formatNumber(row.commentCount) }}</span>
                <span class="stat-label">评论</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="publishedAt" label="发布时间" width="180" align="center">
          <template #default="{ row }">
            {{ row.publishedAt || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-permission="'content:article:edit'"
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>

            <el-button
              v-permission="'content:article:delete'"
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
        @size-change="fetchArticleList"
        @current-change="fetchArticleList"
      />
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入文章标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="URL标识" prop="slug">
          <el-input
            v-model="formData.slug"
            placeholder="请输入URL友好的标识(如: my-article)"
            maxlength="100"
          />
          <div class="text-xs text-gray-500 mt-1">用于生成文章URL,只能包含字母、数字、连字符</div>
        </el-form-item>

        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="formData.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="8"
            placeholder="请输入文章内容(实际项目中应使用富文本编辑器)"
            maxlength="10000"
            show-word-limit
          />
          <div class="text-xs text-gray-500 mt-1">
            提示:实际项目中应集成富文本编辑器(如TinyMCE、Quill)或Markdown编辑器
          </div>
        </el-form-item>

        <el-form-item label="封面图" prop="cover">
          <el-input v-model="formData.cover" placeholder="请输入封面图URL或点击上传">
            <template #append>
              <el-button>
                <template #icon>
                  <Icon icon="ep:upload" />
                </template>
                上传
              </el-button>
            </template>
          </el-input>
          <div class="text-xs text-gray-500 mt-1">提示:实际项目中应集成图片上传组件</div>
          <div v-if="formData.cover" class="mt-2">
            <img :src="formData.cover" alt="封面预览" class="w-32 h-32 object-cover rounded" />
          </div>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%">
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="标签" prop="tagIds">
              <el-select
                v-model="formData.tagIds"
                multiple
                placeholder="请选择标签"
                style="width: 100%"
              >
                <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id">
                  <span
                    :style="{
                      ...getTagStyle(tag.color),
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      display: 'inline-block',
                    }"
                  >
                    {{ tag.name }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="草稿" :value="ArticleStatus.DRAFT" />
                <el-option label="已发布" :value="ArticleStatus.PUBLISHED" />
                <el-option label="已归档" :value="ArticleStatus.ARCHIVED" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="置顶" prop="isTop">
              <el-switch v-model="formData.isTop" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="推荐" prop="isRecommend">
              <el-switch v-model="formData.isRecommend" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Icon } from '@iconify/vue'
import { View, Star, ChatLineRound } from '@element-plus/icons-vue'
import * as contentApi from '@/api/content'
import type {
  Article,
  ArticleListParams,
  ArticleCreateParams,
  ArticleUpdateParams,
  Category,
  Tag,
} from '@/types/content'
import { ArticleStatus } from '@/types/content'

// 状态
const loading = ref(false)
const submitLoading = ref(false)
const articleList = ref<Article[]>([])
const selectedIds = ref<number[]>([])
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 搜索表单
const searchForm = reactive<Partial<ArticleListParams>>({
  title: '',
  author: '',
  categoryId: undefined,
  tagId: undefined,
  status: undefined,
  isTop: undefined,
  isRecommend: undefined,
  startDate: undefined,
  endDate: undefined,
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
const formData = reactive<Partial<ArticleCreateParams & { id?: number }>>({
  title: '',
  slug: '',
  summary: '',
  content: '',
  cover: '',
  categoryId: undefined,
  tagIds: [],
  status: ArticleStatus.DRAFT,
  isTop: false,
  isRecommend: false,
})

// 对话框标题
const dialogTitle = computed(() => (isEdit.value ? '编辑文章' : '新增文章'))

/**
 * 获取标签样式
 */
const getTagStyle = (color: string) => {
  // 判断颜色是否为深色，调整背景色透明度以确保可读性
  const isDarkColor = isColorDark(color)
  const backgroundColor = isDarkColor
    ? `${color}

25`
    : `${color}

15`

  return {
    backgroundColor,
    borderColor: color,
    color: color,
    // 为深色背景增加更强的边框
    borderWidth: isDarkColor ? '1.5px' : '1px',
  }
}

/**
 * 判断颜色是否为深色
 */
const isColorDark = (color: string): boolean => {
  // 将十六进制颜色转换为 RGB
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // 亮度小于 128 被认为是深色
  return brightness < 128
}

/**
 * 格式化数字显示
 */
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 监听日期范围变化
watch(dateRange, (val) => {
  if (val) {
    searchForm.startDate = val[0]
    searchForm.endDate = val[1]
  } else {
    searchForm.startDate = undefined
    searchForm.endDate = undefined
  }
})

// 表单验证规则
const formRules: FormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在 1 到 100 个字符', trigger: 'blur' },
  ],
  slug: [{ pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和连字符', trigger: 'blur' }],
  summary: [{ max: 200, message: '摘要不能超过 200 个字符', trigger: 'blur' }],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 20, message: '内容至少 20 个字符', trigger: 'blur' },
  ],
  cover: [{ required: true, message: '请上传封面图片', trigger: 'change' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  tagIds: [{ type: 'array', message: '请选择标签', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

/**
 * 获取文章列表
 */
const fetchArticleList = async () => {
  loading.value = true
  try {
    const params: ArticleListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      title: searchForm.title,
      author: searchForm.author,
      categoryId: searchForm.categoryId,
      tagId: searchForm.tagId,
      status: searchForm.status,
      isTop: searchForm.isTop,
      isRecommend: searchForm.isRecommend,
      startDate: searchForm.startDate,
      endDate: searchForm.endDate,
    }

    const result = await contentApi.getArticleList(params)
    articleList.value = result.list
    pagination.total = result.total
  } catch (error) {
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 获取分类列表
 */
const fetchCategories = async () => {
  try {
    categories.value = await contentApi.getAllCategories()
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  }
}

/**
 * 获取标签列表
 */
const fetchTags = async () => {
  try {
    tags.value = await contentApi.getAllTags()
  } catch (error) {
    ElMessage.error('获取标签列表失败')
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  pagination.page = 1
  fetchArticleList()
}

/**
 * 重置搜索
 */
const handleReset = () => {
  searchForm.title = ''
  searchForm.author = ''
  searchForm.categoryId = undefined
  searchForm.tagId = undefined
  searchForm.status = undefined
  searchForm.isTop = undefined
  searchForm.isRecommend = undefined
  dateRange.value = null
  handleSearch()
}

/**
 * 选择变化
 */
const handleSelectionChange = (selection: Article[]) => {
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
const handleEdit = async (row: Article) => {
  isEdit.value = true
  dialogVisible.value = true

  try {
    const article = await contentApi.getArticle(row.id)
    Object.assign(formData, {
      id: article.id,
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      cover: article.cover,
      categoryId: article.categoryId,
      tagIds: article.tagIds,
      status: article.status,
      isTop: article.isTop,
      isRecommend: article.isRecommend,
    })
  } catch (error) {
    ElMessage.error('获取文章详情失败')
  }
}

/**
 * 删除
 */
const handleDelete = async (row: Article) => {
  try {
    await ElMessageBox.confirm(`确定要删除文章 "${row.title}" 吗?`, '提示', {
      type: 'warning',
    })

    await contentApi.deleteArticle(row.id)
    ElMessage.success('删除成功')
    fetchArticleList()
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
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 篇文章吗?`, '提示', {
      type: 'warning',
    })

    await contentApi.batchDeleteArticles(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchArticleList()
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

    if (isEdit.value) {
      // 更新
      await contentApi.updateArticle({
        id: formData.id!,
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        content: formData.content,
        cover: formData.cover,
        categoryId: formData.categoryId,
        tagIds: formData.tagIds,
        status: formData.status,
        isTop: formData.isTop,
        isRecommend: formData.isRecommend,
      } as ArticleUpdateParams)
      ElMessage.success('更新成功')
    } else {
      // 创建
      await contentApi.createArticle(formData as ArticleCreateParams)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchArticleList()
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
  formData.title = ''
  formData.slug = ''
  formData.summary = ''
  formData.content = ''
  formData.cover = ''
  formData.categoryId = undefined
  formData.tagIds = []
  formData.status = ArticleStatus.DRAFT
  formData.isTop = false
  formData.isRecommend = false

  formRef.value?.resetFields()
}

// 初始化
onMounted(() => {
  fetchArticleList()
  fetchCategories()
  fetchTags()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.article-tag {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  }

  // 增强文字对比度和可读性
  &:deep(.el-tag__content) {
    font-weight: 500;
    letter-spacing: 0.2px;
  }
}

.article-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px 6px;
  border: 1px solid var(--el-border-color-lighter);
  gap: 3px;
  background-color: var(--el-fill-color-blank);
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-7);
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 40px;
  gap: 1px;
}

.stat-icon {
  font-size: 12px;
  transition: all 0.2s ease;
  margin-bottom: 1px;

  &.view-icon {
    color: var(--el-color-info);
  }

  &.like-icon {
    color: var(--el-color-danger);
  }

  &.comment-icon {
    color: var(--el-color-warning);
  }

  .article-stats:hover & {
    transform: scale(1.15);
  }
}

.stat-value {
  color: var(--el-text-color-primary);
  font-size: 11px;
  line-height: 1;
  font-weight: 600;
}

.stat-label {
  color: var(--el-text-color-secondary);
  font-size: 10px;
  line-height: 1;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background-color: var(--el-border-color-lighter);
}
</style>
