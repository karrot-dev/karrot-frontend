module.exports = {
  extends: 'stylelint-config-recess-order',
  rules: {
    'block-no-empty': null,
    'color-no-invalid-hex': true,
    'comment-empty-line-before': ['always', {
      ignore: ['stylelint-commands', 'after-comment'],
    }],
    'karrot/no-semicolons': true,
    'declaration-colon-space-after': 'always',
    indentation: [2, {
      except: ['value'],
    }],
    'max-empty-lines': 2,
    'rule-empty-line-before': ['always', {
      except: ['first-nested'],
      ignore: ['after-comment'],
    }],
    'unit-whitelist': [
      'px',
      'em',
      'rem',
      '%',
      's',
      'deg',
      'vw',
      'vh',
      'vmax',
    ],
  },
  plugins: [
    './stylelint.no-semicolons.js',
  ],
}
