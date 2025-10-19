export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    // 属性排序
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'flex-direction',
      'justify-content',
      'align-items',
      'width',
      'height',
      'margin',
      'padding',
      'border',
      'background',
      'color',
      'font-size',
      'line-height',
      'text-align',
    ],

    // 允许未知的伪类(Vue的::v-deep等)
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'v-deep', 'v-global', 'v-slotted'],
      },
    ],

    // 允许未知的伪元素
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
      },
    ],

    // 允许未知的@规则
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'unocss'],
      },
    ],

    // 其他规则
    'no-descending-specificity': null,
    'function-url-quotes': 'always',
    'string-quotes': 'single',
    'unit-case': 'lower',
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'property-no-unknown': true,
    'declaration-block-trailing-semicolon': 'always',
    'declaration-block-single-line-max-declarations': 1,
  },
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.vue',
    'dist/**',
    'node_modules/**',
    'packages/admin/src/**/*',
  ],
}
