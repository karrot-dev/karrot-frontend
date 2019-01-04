module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    jest: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'standard',
    'plugin:vue/strongly-recommended',
    'plugin:testcafe/recommended',
  ],
  plugins: [
    'import',
    'testcafe',
  ],
  globals: {
    '__ENV': true,
  },
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV !== 'development' ? 'error' : 'off',
    'brace-style': ['error', 'stroustrup', { 'allowSingleLine': true }],
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'always-multiline'
    }],
    // all below: temporarily disabled
    // TODO fixup our codebase
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {'ignores': ['i18n']}],
    'vue/return-in-computed-property': 'off',
    'vue/require-prop-type-constructor': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-closing-bracket-spacing': 'off',
  },
}
