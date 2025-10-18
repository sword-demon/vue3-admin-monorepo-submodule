/**
 * 通用类型定义工具
 * 提供可复用的泛型类型,减少类型定义的重复
 * 遵循 DRY 原则 - 通过泛型实现类型复用
 * 遵循 SOLID 原则 - 接口隔离,类型职责单一
 */

/**
 * 基础实体接口
 * 所有实体都应该包含这些基础字段
 */
export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

/**
 * 分页请求参数
 * 所有分页查询都应该继承此接口
 */
export interface PageParams {
  page: number
  pageSize: number
}

/**
 * 分页响应结果
 * 泛型 T 表示列表项的类型
 *
 * @example
 * ```ts
 * const result: PageResult<User> = await getUserList(params)
 * ```
 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * API 响应包装
 * 标准的API响应格式
 *
 * @example
 * ```ts
 * const response: ApiResponse<User> = await request.get('/user/1')
 * ```
 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/**
 * 创建参数工具类型
 * 从实体类型中移除服务端生成的字段,生成创建参数类型
 * 遵循 YAGNI 原则 - 只包含创建时需要的字段
 *
 * @example
 * ```ts
 * type UserCreateParams = CreateParams<User>
 * // 自动移除 id, createdAt, updatedAt 字段
 * ```
 */
export type CreateParams<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

/**
 * 更新参数工具类型
 * 从实体类型生成更新参数类型,保留id,其他字段可选
 * 遵循 KISS 原则 - 简单的类型转换
 *
 * @example
 * ```ts
 * type UserUpdateParams = UpdateParams<User>
 * // id 必填,其他字段可选
 * ```
 */
export type UpdateParams<T extends BaseEntity> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: number
}

/**
 * 列表查询参数工具类型
 * 结合分页参数和自定义搜索条件
 * 遵循 SOLID 原则 - 组合优于继承
 *
 * @example
 * ```ts
 * interface UserSearchParams {
 *   username?: string
 *   status?: UserStatus
 * }
 * type UserListParams = ListParams<UserSearchParams>
 * // 自动包含分页参数
 * ```
 */
export type ListParams<T = Record<string, unknown>> = T & PageParams

/**
 * 状态枚举基础类型
 * 标准的启用/禁用状态
 */
export enum CommonStatus {
  DISABLED = 0,
  ENABLED = 1,
}

/**
 * 时间戳范围查询参数
 * 用于日期范围筛选
 */
export interface TimeRangeParams {
  startTime?: string
  endTime?: string
}

/**
 * 排序参数
 * 通用的排序条件
 */
export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * ID数组参数
 * 用于批量操作
 */
export interface IdsParams {
  ids: number[]
}

/**
 * 树形节点接口
 * 用于菜单、组织架构等树形数据结构
 */
export interface TreeNode<T = unknown> {
  id: number
  parentId: number
  children?: TreeNode<T>[]
  [key: string]: unknown
}

/**
 * 选项接口
 * 用于下拉选择、单选、多选等场景
 */
export interface Option<V = unknown> {
  label: string
  value: V
  disabled?: boolean
  children?: Option<V>[]
}

/**
 * 上传文件响应
 */
export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}

/**
 * 条件类型工具:使字段必填
 * @example
 * type RequiredUser = RequiredFields<User, 'email' | 'phone'>
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * 条件类型工具:使字段只读
 * @example
 * type ReadonlyUser = ReadonlyFields<User, 'id' | 'createdAt'>
 */
export type ReadonlyFields<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>

/**
 * 深度Partial类型
 * 递归地将所有属性变为可选
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * 提取Promise的返回值类型
 * @example
 * type UserData = UnwrapPromise<ReturnType<typeof getUser>>
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

/**
 * 数组元素类型提取
 * @example
 * type User = ArrayElement<User[]>
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never
