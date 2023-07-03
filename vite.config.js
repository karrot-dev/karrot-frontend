import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const aliases = require('./aliases').resolve.alias

// I *think* this config file is only used during testing

export default defineConfig({
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
  resolve: {
    alias: aliases,
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({}),
  ],
})
