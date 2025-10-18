/**
 * 表格管理 Composable
 * 提供分页、选择、加载状态管理功能
 * 遵循 KISS 原则 - 职责单一,只管理表格相关状态
 */

import { ref, reactive, type Ref } from 'vue'

export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  pageSizes?: number[]
}

export interface UseTableOptions {
  /** 初始页码,默认 1 */
  initialPage?: number
  /** 初始每页大小,默认 10 */
  initialPageSize?: number
  /** 可选的每页大小选项,默认 [10, 20, 50, 100] */
  pageSizes?: number[]
  /** 当分页改变时的回调函数 */
  onPageChange?: () => void | Promise<void>
}

export interface UseTableReturn<T extends { id: number } = { id: number }> {
  /** 加载状态 */
  loading: Ref<boolean>
  /** 表格数据 */
  dataList: Ref<T[]>
  /** 选中的行ID */
  selectedIds: Ref<number[]>
  /** 分页配置 */
  pagination: PaginationConfig
  /** 处理选择变化 */
  handleSelectionChange: (selection: T[]) => void
  /** 重置分页到第一页 */
  resetPage: () => void
  /** 设置总数 */
  setTotal: (total: number) => void
  /** 设置数据列表 */
  setDataList: (list: T[]) => void
}

/**
 * 表格管理 Hook
 *
 * 提供完整的表格状态管理,包括分页、多选、加载状态和数据管理。
 * 遵循KISS原则 - 职责单一,只管理表格相关状态,不处理业务逻辑。
 *
 * @template T - 表格行数据类型,必须包含id字段
 * @param options - 表格配置选项
 * @param options.initialPage - 初始页码,默认1
 * @param options.initialPageSize - 初始每页大小,默认10
 * @param options.pageSizes - 可选的每页大小选项,默认[10, 20, 50, 100]
 * @param options.onPageChange - 分页改变时的回调函数,用于重新加载数据
 * @returns 表格管理对象,包含状态和操作方法
 *
 * @example
 * ```ts
 * // 定义表格数据类型
 * interface User {
 *   id: number
 *   username: string
 *   email: string
 * }
 *
 * // 初始化表格Hook
 * const {
 *   loading,
 *   dataList,
 *   selectedIds,
 *   pagination,
 *   handleSelectionChange,
 *   resetPage,
 *   setTotal,
 *   setDataList,
 * } = useTable<User>({
 *   onPageChange: fetchUserList
 * })
 *
 * // 加载数据
 * const fetchUserList = async () => {
 *   loading.value = true
 *   try {
 *     const res = await systemApi.getUserList({
 *       page: pagination.page,
 *       pageSize: pagination.pageSize,
 *       ...searchForm
 *     })
 *     setDataList(res.data.list)
 *     setTotal(res.data.total)
 *   } finally {
 *     loading.value = false
 *   }
 * }
 *
 * // 在模板中使用
 * <el-table
 *   v-loading="loading"
 *   :data="dataList"
 *   @selection-change="handleSelectionChange"
 * >
 *   <el-table-column type="selection" />
 *   <!-- 其他列 -->
 * </el-table>
 *
 * <el-pagination
 *   v-model:current-page="pagination.page"
 *   v-model:page-size="pagination.pageSize"
 *   :total="pagination.total"
 *   :page-sizes="pagination.pageSizes"
 *   @current-change="fetchUserList"
 *   @size-change="fetchUserList"
 * />
 * ```
 */
export function useTable<T extends { id: number }>(
  options: UseTableOptions = {}
): UseTableReturn<T> {
  const {
    initialPage = 1,
    initialPageSize = 10,
    pageSizes = [10, 20, 50, 100],
    onPageChange,
  } = options

  // 加载状态
  const loading = ref(false)

  // 表格数据
  const dataList = ref<T[]>([]) as Ref<T[]>

  // 选中的行ID
  const selectedIds = ref<number[]>([])

  // 分页配置 (使用 reactive 保持响应式)
  const pagination = reactive<PaginationConfig>({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pageSizes,
  })

  /**
   * 处理选择变化
   * 遵循 KISS 原则 - 简单的数组映射
   */
  const handleSelectionChange = (selection: T[]) => {
    selectedIds.value = selection.map((item) => item.id)
  }

  /**
   * 重置到第一页
   * 触发页面变化回调
   */
  const resetPage = () => {
    pagination.page = 1
    onPageChange?.()
  }

  /**
   * 设置总数
   * 用于API响应后更新分页信息
   * 遵循防御性编程 - 验证输入有效性
   */
  const setTotal = (total: number) => {
    // 验证总数为非负数
    if (typeof total !== 'number' || total < 0) {
      console.warn('[useTable] Invalid total value:', total)
      pagination.total = 0
      return
    }
    pagination.total = total
  }

  /**
   * 设置数据列表
   * 用于API响应后更新表格数据
   * 遵循防御性编程 - 验证输入为有效数组
   */
  const setDataList = (list: T[]) => {
    // 验证输入为有效数组
    if (!Array.isArray(list)) {
      console.warn('[useTable] Invalid dataList value:', list)
      dataList.value = []
      return
    }
    dataList.value = list
  }

  return {
    loading,
    dataList,
    selectedIds,
    pagination,
    handleSelectionChange,
    resetPage,
    setTotal,
    setDataList,
  }
}
