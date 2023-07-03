/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli-vite/quasar-config-js
/* eslint-env node */

const { resolve } = require('path')

const { configure } = require('quasar/wrappers')

const aliases = require('./aliases').resolve.alias
const { getHttpsOptions } = require('./build/https')

module.exports = configure(function (ctx) {
  const { backend, proxyTable } = require('./build/config')

  const appEnv = {
    KARROT: {
      BACKEND: backend,
      THEME: process.env.KARROT_THEME,
      GIT_SHA1: process.env.GIT_SHA1 || process.env.CIRCLE_SHA1,
    },
    NODE_DEBUG: 'false', // workaround for node-util
    ENABLE_DEV_SENTRY: process.env.ENABLE_DEV_SENTRY,
  }

  return {
    supportTS: false,
    htmlVariables: {
      title: 'Karrot - Start a group, become a community',
    },
    boot: [
      'vueQuery',
      'loglevel',
      'pwa',
      'helloDeveloper',
      'addressbar-color',
      'cordova',
      'i18n',
      'bootstrapData',
      'polyfill',
      'icons',
      'detectMobileKeyboard',
      'performance',
    ],
    css: [
      'app.sass',
    ],
    extras: [
      'fontawesome-v5',
      'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      'material-icons',
    ],
    build: {
      env: appEnv,
      sourceMap: true,
      alias: {
        ...aliases,
      },
      vitePlugins: [
        ['@intlify/unplugin-vue-i18n/vite', {
          compositionOnly: false,
          include: [resolve(__dirname, './src/locales/locale-*.json')],
        }],
        ['rollup-plugin-visualizer', {
          emitFile: true,
          gzipSize: true,
          filename: 'bundlesize.html',
        }],
      ],
    },
    devServer: {
      https: ctx.dev && ctx.mode.pwa ? getHttpsOptions() : false,
      port: ctx.mode.pwa ? 8082 : 8080, // different port is recommended to avoid caching issues between modes
      open: !process.env.NO_OPEN_BROWSER, // opens browser window automatically
      proxy: proxyTable,
    },
    framework: {
      iconSet: 'material-icons',
      lang: 'en-US',
      config: {},

      // Quasar plugins
      plugins: [
        'Dialog',
        'AppVisibility',
        'Notify',
        'AddressbarColor',
      ],
    },
    animations: [],
    pwa: {
      extendManifestJson (manifest) {
        if (process.env.PWA_APP_NAME) {
          manifest.name = process.env.PWA_APP_NAME
          manifest.short_name = process.env.PWA_APP_NAME
        }
        if (process.env.KARROT_THEME) {
          manifest.icons = [
            {
              src: 'icons/dev.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'icons/dev.svg',
            },
          ]
        }
      },
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        // All the paths that already have file hashes in them
        // other files will have a ?__WB_REVISION__=<revision> parameter added to them.
        // Some people say that in theory workbox can already detect the ones with the hash, but doesn't seem so.
        // if you want to see the entries in the cache you can put this in a service worker debugging console:
        //
        //     urls = (await (await caches.open((await caches.keys())[0])).keys()).map(e => e.url)
        //
        dontCacheBustURLsMatching: /^(css|js|img|fonts)\//,
        exclude: [
          // A partial solution to a more complex issue
          // See https://github.com/karrot-dev/karrot-frontend/issues/2209
          'index.html',
        ],
      },
    },
  }
})
