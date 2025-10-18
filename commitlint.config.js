export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档变更
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 测试相关
        'build', // 构建系统或外部依赖变更
        'ci', // CI配置文件和脚本变更
        'chore', // 其他不修改src或test文件的变更
        'revert', // 回退commit
      ],
    ],
    // subject大小写不限制
    'subject-case': [0],
  },
}
