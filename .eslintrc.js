module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },

  env: {
    browser: true,
    jest: true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)
    'plugin:import/recommended',
    'standard',

  ],

  plugins: [
    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    // required to lint *.vue files
    'vue',
  ],

  globals: {
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true,
  },

  // add your custom rules here
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
