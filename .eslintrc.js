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
    'plugin:vue/strongly-recommended'
  ],
  plugins: [
    'import'
  ],
  globals: {
    'DEV': true,
    'PROD': true,
    'CORDOVA': true,
    'BACKEND': true,
    '__THEME': true
  },
  // add your custom rules here
  'rules': {
    // We relax some of the vue rules for now as they require a lot of manual changes
    // TODO: comply with the rules, then remove these lines
    'vue/max-attributes-per-line': 0,
    'vue/require-prop-types': 0,
    'vue/require-default-prop': 0,

    // allow paren-less arrow functions
    'arrow-parens': 0,
    'one-var': 0,
    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }],
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'always-multiline'
    }],
  }
}
