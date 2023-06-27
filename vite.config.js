import path from 'path'

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const aliases = require('./aliases').resolve.alias

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
    VueI18nPlugin({
      include: [path.resolve(__dirname, './src/locales/locale-*.json')],
    }),
  ],
})
