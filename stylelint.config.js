module.exports = {
  extends: [
    'stylelint-config-recess-order',
  ],
  rules: {
    'block-no-empty': null,
    'color-no-invalid-hex': true,
    'comment-empty-line-before': ['always', {
      ignore: ['stylelint-commands', 'after-comment'],
    }],
    'function-comma-newline-after': 'always-multi-line',
    'function-comma-space-after': 'always-single-line',
    'function-comma-space-before': 'never',
    'function-max-empty-lines': 0,
    'function-name-case': 'lower',
    'function-parentheses-newline-inside': 'always-multi-line',
    'function-parentheses-space-inside': 'never-single-line',
    'function-whitespace-after': 'always',
    'declaration-colon-space-after': 'always',
    indentation: 2,
    'max-empty-lines': 2,
    'rule-empty-line-before': ['always', {
      except: ['first-nested'],
      ignore: ['after-comment'],
    }],
    'unit-allowed-list': [
      'px',
      'em',
      'rem',
      '%',
      's',
      'deg',
      'vw',
      'vh',
      'vmax',
      'fr',
    ],
  },
}
