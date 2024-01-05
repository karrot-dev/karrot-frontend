/*
This vite configuration file is used duration testing.

We could name it vitest.config.js and it would also be loaded.

It's named vite.config.js as some editors can benefit from accessing it.
The configuration should be equivalent to what quasar cli does, but
it does not use this file itself.
*/

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const aliases = require('./aliases').resolve.alias

export default defineConfig({
  resolve: {
    alias: aliases,
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: '@/css/quasar.variables.sass',
    }),
  ],
  test: {
    testTimeout: 120 * 1000,
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      'test/setup/env.js',
      'test/setup/unhandledPromiseRejectionHandler.js',
      'test/setup/mockRandom.js',
      'test/setup/mockScroll.js',
      'test/setup/mockUserAgent.js',
      'test/setup/mockStylesheets.js',
      'test/setup/mockLocation.js',
      'test/setup/mockSVGAnimations.js',
    ],
    coverage: {
      all: true,
      include: [
        'src/**/*',
      ],
      extension: [
        '.js',
        '.vue',
      ],
      reporter: [
        'json',
        'lcov',
        'text',
      ],
      exclude: [
        '**/*.story.js',
        '**/*.spec.js',
        '**/*.d.ts',
      ],
    },
  },
})
