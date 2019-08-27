module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      useBuiltIns: 'usage',
      corejs: 3,
    }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
    }],
    // To enable tree-shaking support in quasar in production we rewrite imports
    // This changes things like `import { QBtn } from 'quasar'` into `import QBtn from 'quasar/blah/QBtn'`
    ['babel-plugin-transform-imports', {
      quasar: {
        transform: require('quasar/dist/babel-transforms/imports.js'),
        preventFullImport: true,
      },
    }],
  ],
  env: {
    test: {
      plugins: [
        // During testing we need a dynamic import implemention for nodejs
        'babel-plugin-dynamic-import-node',
        // Jest wants commonjs modules so we transform them
        '@babel/plugin-transform-modules-commonjs',
      ],
      // Line numbers in jest tracebacks should make sense, even without sourcemaps
      retainLines: true,
    },
  },
}
