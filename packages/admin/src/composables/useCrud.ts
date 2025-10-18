/**
 * CRUD操作管理 Composable
 * 提供创建、更新、删除、批量删除等标准CRUD操作
 * 遵循 DRY 原则 - 统一的错误处理和成功提示
 * 遵循 SOLID 原则 - 依赖抽象(API函数),不依赖具体实现
 */

import { ElMessage, ElMessageBox } from 'element-plus'

export interface CrudApi<T, CreateParams, UpdateParams> {
  /** 创建API */
  create?: (data: CreateParams) => Promise<T>
  /** 更新API */
  update?: (data: UpdateParams) => Promise<T>
  /** 删除API */
  delete?: (id: number) => Promise<void>
  /** 批量删除API */
  batchDelete?: (ids: number[]) => Promise<void>
  /** 列表查询API(用于刷新) */
  list?: (...args: unknown[]) => Promise<unknown>
}

export interface CrudMessages {
  /** 创建成功提示 */
  createSuccess?: string
  /** 创建失败提示 */
  createError?: string
  /** 更新成功提示 */
  updateSuccess?: string
  /** 更新失败提示 */
  updateError?: string
  /** 删除确认提示 */
  deleteConfirm?: string
  /** 删除成功提示 */
  deleteSuccess?: string
  /** 删除失败提示 */
  deleteError?: string
  /** 批量删除确认提示 */
  batchDeleteConfirm?: string
  /** 批量删除成功提示 */
  batchDeleteSuccess?: string
  /** 批量删除失败提示 */
  batchDeleteError?: string
}

export interface UseCrudOptions<T, CreateParams, UpdateParams> {
  /** API函数集合 */
  api: CrudApi<T, CreateParams, UpdateParams>
  /** 提示消息配置 */
  messages?: CrudMessages
  /** 操作成功后的刷新回调 */
  onRefresh?: () => void | Promise<void>
}

export interface UseCrudReturn<CreateParams, UpdateParams> {
  /** 创建记录 */
  handleCreate: (data: CreateParams) => Promise<boolean>
  /** 更新记录 */
  handleUpdate: (data: UpdateParams) => Promise<boolean>
  /** 删除记录 */
  handleDelete: (id: number, name?: string) => Promise<boolean>
  /** 批量删除记录 */
  handleBatchDelete: (ids: number[]) => Promise<boolean>
}

/**
 * CRUD操作管理 Hook
 *
 * 提供标准的CRUD(创建、更新、删除、批量删除)操作封装,统一处理错误、成功提示和数据刷新。
 * 遵循DRY原则 - 统一的错误处理和成功提示逻辑。
 * 遵循SOLID原则 - 依赖抽象(API函数),不依赖具体实现。
 *
 * @template T - 实体类型
 * @template CreateParams - 创建参数类型
 * @template UpdateParams - 更新参数类型
 * @param options - CRUD配置选项
 * @param options.api - API函数集合,包含create/update/delete/batchDelete等方法
 * @param options.messages - 可选的提示消息配置,用于自定义成功/失败提示文本
 * @param options.onRefresh - 操作成功后的刷新回调,用于重新加载列表数据
 * @returns CRUD操作管理对象,包含创建、更新、删除、批量删除方法
 *
 * @example
 * ```ts
 * // 基础用法
 * const { handleCreate, handleUpdate, handleDelete, handleBatchDelete } = useCrud({
 *   api: {
 *     create: systemApi.createUser,
 *     update: systemApi.updateUser,
 *     delete: systemApi.deleteUser,
 *     batchDelete: systemApi.batchDeleteUsers,
 *   },
 *   messages: {
 *     createSuccess: '创建用户成功',
 *     deleteConfirm: '确定要删除用户吗?'
 *   },
 *   onRefresh: fetchUserList
 * })
 *
 * // 在组件中使用
 * const onSubmit = async () => {
 *   const success = isEdit.value
 *     ? await handleUpdate({ id: currentUser.id, ...formData })
 *     : await handleCreate(formData)
 *
 *   if (success) {
 *     closeDialog()
 *   }
 * }
 *
 * // 删除操作(带确认)
 * <el-button @click="handleDelete(user.id, user.username)">删除</el-button>
 *
 * // 批量删除
 * <el-button @click="handleBatchDelete(selectedIds)">批量删除</el-button>
 * ```
 */
export function useCrud<T, CreateParams, UpdateParams>(
  options: UseCrudOptions<T, CreateParams, UpdateParams>
): UseCrudReturn<CreateParams, UpdateParams> {
  const {
    api,
    messages = {},
    onRefresh,
  } = options

  // 默认提示消息
  const defaultMessages: Required<CrudMessages> = {
    createSuccess: '创建成功',
    createError: '创建失败',
    updateSuccess: '更新成功',
    updateError: '更新失败',
    deleteConfirm: '确定要删除吗?',
    deleteSuccess: '删除成功',
    deleteError: '删除失败',
    batchDeleteConfirm: '确定要删除选中的记录吗?',
    batchDeleteSuccess: '批量删除成功',
    batchDeleteError: '批量删除失败',
  }

  const finalMessages = { ...defaultMessages, ...messages }

  /**
   * 创建记录
   * 遵循 KISS 原则 - 简单的try-catch处理
   * 遵循防御性编程 - 详细记录错误信息
   * @returns 是否成功
   */
  const handleCreate = async (data: CreateParams): Promise<boolean> => {
    if (!api.create) {
      console.error('[useCrud] Create API is not provided')
      return false
    }

    try {
      await api.create(data)
      ElMessage.success(finalMessages.createSuccess)
      await onRefresh?.()
      return true
    } catch (error: unknown) {
      console.error('[useCrud] Create failed:', error)
      const message = error instanceof Error ? error.message : finalMessages.createError
      ElMessage.error(message)
      return false
    }
  }

  /**
   * 更新记录
   * 遵循 KISS 原则 - 简单的try-catch处理
   * 遵循防御性编程 - 详细记录错误信息
   * @returns 是否成功
   */
  const handleUpdate = async (data: UpdateParams): Promise<boolean> => {
    if (!api.update) {
      console.error('[useCrud] Update API is not provided')
      return false
    }

    try {
      await api.update(data)
      ElMessage.success(finalMessages.updateSuccess)
      await onRefresh?.()
      return true
    } catch (error: unknown) {
      console.error('[useCrud] Update failed:', error)
      const message = error instanceof Error ? error.message : finalMessages.updateError
      ElMessage.error(message)
      return false
    }
  }

  /**
   * 删除记录
   * 包含用户确认对话框
   * 遵循防御性编程 - 详细记录错误信息
   * @param id - 记录ID
   * @param name - 记录名称(用于确认提示)
   * @returns 是否成功
   */
  const handleDelete = async (id: number, name?: string): Promise<boolean> => {
    if (!api.delete) {
      console.error('[useCrud] Delete API is not provided')
      return false
    }

    try {
      // 构建确认消息
      let confirmMessage = finalMessages.deleteConfirm
      if (name) {
        confirmMessage = `确定要删除 "${name}" 吗?`
      }

      // 用户确认
      await ElMessageBox.confirm(confirmMessage, '提示', {
        type: 'warning',
      })

      // 执行删除
      await api.delete(id)
      ElMessage.success(finalMessages.deleteSuccess)
      await onRefresh?.()
      return true
    } catch (error: unknown) {
      if (error === 'cancel') {
        return false
      }
      console.error('[useCrud] Delete failed:', error)
      const message = error instanceof Error ? error.message : finalMessages.deleteError
      ElMessage.error(message)
      return false
    }
  }

  /**
   * 批量删除记录
   * 包含用户确认对话框
   * 遵循防御性编程 - 验证输入并记录错误
   * @param ids - 记录ID数组
   * @returns 是否成功
   */
  const handleBatchDelete = async (ids: number[]): Promise<boolean> => {
    if (!api.batchDelete) {
      console.error('[useCrud] Batch delete API is not provided')
      return false
    }

    // 验证输入
    if (!Array.isArray(ids) || ids.length === 0) {
      ElMessage.warning('请选择要删除的记录')
      return false
    }

    try {
      // 用户确认
      await ElMessageBox.confirm(
        `确定要删除选中的 ${ids.length} 条记录吗?`,
        '提示',
        {
          type: 'warning',
        }
      )

      // 执行批量删除
      await api.batchDelete(ids)
      ElMessage.success(finalMessages.batchDeleteSuccess)
      await onRefresh?.()
      return true
    } catch (error: unknown) {
      if (error === 'cancel') {
        return false
      }
      console.error('[useCrud] Batch delete failed:', error)
      const message = error instanceof Error ? error.message : finalMessages.batchDeleteError
      ElMessage.error(message)
      return false
    }
  }

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBatchDelete,
  }
}
