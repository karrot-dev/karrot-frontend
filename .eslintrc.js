module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2021,
  },
  env: {
    browser: true,
    jest: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:import/recommended',
    'plugin:vitest/recommended',
    'standard',
  ],
  plugins: [
    'vue',
    'vitest',
  ],
  globals: {
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true,
  },
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    'import/no-unresolved': 'off',
    'import/order': ['error', {
      groups: [
        'builtin', // node "builtin" modules
        'external',
        'internal',
        'parent', // modules from a "parent" directory ('../blah')
        'sibling', // "sibling" modules from the same or a sibling's directory ('./foo/foo')
        'index', // "index" of the current directory ('./')
        'object', // typescript stuff
        'type', // typescript stuff
      ],
      pathGroups: [
        {
          // put component files nicely below
          pattern: '@/**/components/**',
          group: 'internal',
          position: 'after',
        },
        {
          pattern: '@/**',
          group: 'internal',
        },
        {
          pattern: '>/**',
          group: 'internal',
          position: 'after',
        },
      ],
      pathGroupsExcludedImportTypes: [],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
      },
    }],
    'prefer-promise-reject-errors': 'off',
    'multiline-ternary': ['error', 'always-multiline'],

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    // do not capitalize the "I" in "i18n" component name
    'vue/component-name-in-template-casing': ['error', 'PascalCase', { ignores: ['i18n'] }],
    // allow single word component names, see https://github.com/karrot-dev/karrot-frontend/issues/2463
    'vue/multi-word-component-names': 'off',

    // allow tests without expect()
    // often something like findByTitle() is enough
    'vitest/expect-expect': 'off',
  },

  settings: {
    // uses 'eslint-import-resolver-webpack':
    'import/resolver': {
      webpack: {
        config: './aliases.js',
      },
    },
  },
}
