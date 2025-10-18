/**
 * 对话框管理 Composable
 * 提供对话框显隐、编辑/创建模式、提交状态管理
 * 遵循 KISS 原则 - 职责单一,只管理对话框状态
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface UseDialogOptions {
  /** 创建模式下的标题 */
  createTitle?: string
  /** 编辑模式下的标题 */
  editTitle?: string
}

export interface UseDialogReturn {
  /** 对话框是否可见 */
  dialogVisible: Ref<boolean>
  /** 是否为编辑模式 */
  isEdit: Ref<boolean>
  /** 提交加载状态 */
  submitLoading: Ref<boolean>
  /** 对话框标题(根据编辑/创建模式自动切换) */
  dialogTitle: ComputedRef<string>
  /** 打开创建对话框 */
  openCreateDialog: () => void
  /** 打开编辑对话框 */
  openEditDialog: () => void
  /** 关闭对话框 */
  closeDialog: () => void
  /** 开始提交(设置loading为true) */
  startSubmit: () => void
  /** 完成提交(设置loading为false) */
  endSubmit: () => void
}

/**
 * 对话框管理 Hook
 *
 * 提供完整的对话框状态管理,包括显隐控制、编辑/创建模式切换、提交状态管理。
 * 适用于表单对话框的标准场景。
 *
 * @param options - 对话框配置选项
 * @param options.createTitle - 创建模式下的对话框标题,默认"新增"
 * @param options.editTitle - 编辑模式下的对话框标题,默认"编辑"
 * @returns 对话框管理对象,包含状态和控制方法
 *
 * @example
 * ```ts
 * // 基础用法
 * const {
 *   dialogVisible,
 *   isEdit,
 *   submitLoading,
 *   dialogTitle,
 *   openCreateDialog,
 *   openEditDialog,
 *   closeDialog,
 *   startSubmit,
 *   endSubmit,
 * } = useDialog({
 *   createTitle: '新增用户',
 *   editTitle: '编辑用户'
 * })
 *
 * // 在模板中使用
 * <el-dialog v-model="dialogVisible" :title="dialogTitle">
 *   <el-form>...</el-form>
 *   <template #footer>
 *     <el-button @click="closeDialog">取消</el-button>
 *     <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
 *       确定
 *     </el-button>
 *   </template>
 * </el-dialog>
 *
 * // 打开对话框
 * <el-button @click="openCreateDialog">新增</el-button>
 * <el-button @click="openEditDialog">编辑</el-button>
 * ```
 */
export function useDialog(options: UseDialogOptions = {}): UseDialogReturn {
  const { createTitle = '新增', editTitle = '编辑' } = options

  // 对话框可见性
  const dialogVisible = ref(false)

  // 是否为编辑模式
  const isEdit = ref(false)

  // 提交加载状态
  const submitLoading = ref(false)

  /**
   * 对话框标题
   * 根据编辑/创建模式自动切换
   * 遵循 KISS 原则 - 简单的三元运算
   */
  const dialogTitle = computed(() => (isEdit.value ? editTitle : createTitle))

  /**
   * 打开创建对话框
   * 设置为非编辑模式
   */
  const openCreateDialog = () => {
    isEdit.value = false
    dialogVisible.value = true
  }

  /**
   * 打开编辑对话框
   * 设置为编辑模式
   */
  const openEditDialog = () => {
    isEdit.value = true
    dialogVisible.value = true
  }

  /**
   * 关闭对话框
   * 重置提交状态
   */
  const closeDialog = () => {
    dialogVisible.value = false
    submitLoading.value = false
  }

  /**
   * 开始提交
   * 设置loading为true
   */
  const startSubmit = () => {
    submitLoading.value = true
  }

  /**
   * 完成提交
   * 设置loading为false
   */
  const endSubmit = () => {
    submitLoading.value = false
  }

  return {
    dialogVisible,
    isEdit,
    submitLoading,
    dialogTitle,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    startSubmit,
    endSubmit,
  }
}
