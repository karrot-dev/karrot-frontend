import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const aliases = require('./aliases').resolve.alias

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      'test/setup/env.js',
      'test/setup/unhandledPromiseRejectionHandler.js',
      'test/setup/mockRandom.js',
      'test/setup/mockScroll.js',
      'test/setup/mockUserAgent.js',
      'test/setup/mockLocation.js',
    ],
  },
  resolve: {
    alias: {
      ...aliases,
    },
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({}),
  ],
})
