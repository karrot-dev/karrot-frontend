// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
