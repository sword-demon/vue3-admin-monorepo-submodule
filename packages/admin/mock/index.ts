/**
 * Mock API 入口文件
 * 统一导出所有 mock API
 */

import userMock from './user'
import systemMock from './system'
// import contentMock from './content' // 暂时禁用
import analyticsMock from './analytics'
import contentMock from './content'
import reportMock from './report'

export default [
  ...userMock,
  ...systemMock,
  ...contentMock,
  ...analyticsMock,
  ...reportMock,
]
