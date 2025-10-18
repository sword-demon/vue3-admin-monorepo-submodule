/**
 * 搜索管理 Composable
 * 提供搜索和重置功能
 * 遵循 KISS 原则 - 简单的表单重置和搜索触发
 */

import { type UnwrapRef } from 'vue'

export interface UseSearchOptions<T> {
  /** 搜索表单的初始值 */
  initialForm: T
  /** 搜索回调函数 */
  onSearch: () => void | Promise<void>
  /** 重置页码回调(通常用于重置分页到第一页) */
  onResetPage?: () => void
}

export interface UseSearchReturn<T> {
  /** 执行搜索 */
  handleSearch: () => void | Promise<void>
  /** 重置搜索表单 */
  handleReset: (form: UnwrapRef<T>) => void | Promise<void>
}

/**
 * 搜索管理 Hook
 *
 * 提供搜索表单的搜索和重置功能,自动处理页码重置和数据刷新。
 * 遵循KISS原则 - 简单的表单重置和搜索触发,无额外复杂逻辑。
 *
 * @template T - 搜索表单的类型,必须为对象类型
 * @param options - 搜索配置选项
 * @param options.initialForm - 搜索表单的初始值,用于重置时恢复
 * @param options.onSearch - 搜索回调函数,执行实际的数据查询
 * @param options.onResetPage - 可选的页码重置回调,通常用于将分页重置到第一页
 * @returns 搜索管理对象,包含搜索和重置方法
 *
 * @example
 * ```ts
 * // 定义搜索表单
 * const searchForm = reactive<Partial<UserListParams>>({
 *   username: '',
 *   status: undefined,
 * })
 *
 * // 初始化搜索Hook
 * const { handleSearch, handleReset } = useSearch({
 *   initialForm: {
 *     username: '',
 *     status: undefined,
 *   },
 *   onSearch: fetchUserList,
 *   onResetPage: () => { pagination.page = 1 }
 * })
 *
 * // 在模板中使用
 * <SearchForm
 *   v-model="searchForm"
 *   @search="handleSearch"
 *   @reset="handleReset(searchForm)"
 * />
 *
 * // 或直接绑定到按钮
 * <el-button @click="handleSearch">搜索</el-button>
 * <el-button @click="handleReset(searchForm)">重置</el-button>
 * ```
 */
export function useSearch<T extends Record<string, unknown>>(
  options: UseSearchOptions<T>
): UseSearchReturn<T> {
  const { initialForm, onSearch, onResetPage } = options

  /**
   * 执行搜索
   * 1. 重置分页到第一页(如果提供了回调)
   * 2. 触发搜索回调
   * 遵循 KISS 原则 - 简单的函数调用序列
   */
  const handleSearch = async () => {
    onResetPage?.()
    await onSearch()
  }

  /**
   * 重置搜索表单
   * 1. 将表单恢复到初始值
   * 2. 触发搜索(使用初始值重新查询)
   * 遵循 KISS 原则 - 使用Object.assign简单赋值
   * 遵循防御性编程 - 验证输入有效性
   *
   * @param form - 要重置的表单对象(reactive)
   */
  const handleReset = async (form: UnwrapRef<T>) => {
    // 验证表单对象有效性
    if (!form || typeof form !== 'object') {
      console.warn('[useSearch] Invalid form object:', form)
      return
    }

    Object.assign(form, initialForm)
    await handleSearch()
  }

  return {
    handleSearch,
    handleReset,
  }
}
