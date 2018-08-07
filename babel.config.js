module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      useBuiltIns: 'usage',
    }],
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
  ],
  env: {
    test: {
      plugins: [
        // During testing we need a dynamic import implemention for nodejs
        'babel-plugin-dynamic-import-node',
        // Jest wants commonjs modules so we transform them
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
    production: {
      plugins: [
        // To enable tree-shaking support in quasar in production we rewrite imports
        // This changes things like `import { QBtn } from 'quasar'` into `import QBtn from 'quasar/blah/QBtn'`
        ['babel-plugin-transform-imports', {
          quasar: {
            transform: 'quasar-framework/dist/babel-transforms/imports.mat.js',
            preventFullImport: true,
          },
        }],
      ],
    },
  },
}
