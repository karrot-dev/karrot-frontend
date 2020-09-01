
module.exports = {
  presets: [
    '@quasar/babel-preset-app',
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
