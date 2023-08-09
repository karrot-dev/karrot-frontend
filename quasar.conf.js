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
      alias: aliases,
      target: {
        // https://esbuild.github.io/api/#target
        // Trying to make the most compatible version possible :)
        browser: ['es2015', 'edge18', 'firefox60', 'chrome55', 'opera2017', 'ios12'],
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
      cssAddon: true,
      iconSet: 'material-icons',
      lang: 'en-US',
      config: {},
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
      workboxMode: 'injectManifest',
      extendInjectManifestOptions (injectManifestOptions) {
        // I'm not totally sure which options are the best to use here, but should be OK for now :)
        // https://developer.chrome.com/docs/workbox/reference/workbox-build/#method-injectManifest
        Object.assign(injectManifestOptions, {
          // Workbox is passed the directory of all the built files, then globs for which ones should be precached
          // using these patterns... by default it's *everything* minus a few service worker things
          // That means it would load ALL our built files up front...
          // ... change it to not precache anything
          globPatterns: [],
          globIgnores: [
            ...injectManifestOptions.globIgnores,
            // A partial solution to a more complex issue
            // See https://github.com/karrot-dev/karrot-frontend/issues/2209
            'index.html',
          ],
          // Everything in here has already got hashed path names, so don't need to add more
          dontCacheBustURLsMatching: /^assets\//,
        })
      },
    },
  }
})
