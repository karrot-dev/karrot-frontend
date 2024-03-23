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
    },
    NODE_DEBUG: 'false', // workaround for node-util
    ENABLE_DEV_SENTRY: process.env.ENABLE_DEV_SENTRY,
    LOCAL_PLUGINS: process.env.LOCAL_PLUGINS,
    KARROT_VERSION: process.env.KARROT_VERSION || 'development',
    KARROT_COMMIT: process.env.KARROT_COMMIT || 'unknown',
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
      'i18n',
      'bootstrapData',
      'polyfill',
      'icons',
      'detectMobileKeyboard',
      'performance',
      'plugins',
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
        // This is to expose things that plugins can make use of
        [GenerateImportMap, {
          imports: {
            vue: './src/plugin/vue.js',
            'vue-router': './src/plugin/vue-router.js',
            quasar: './src/plugin/quasar.js',
            axios: './src/plugin/axios.js',
            '@tanstack/vue-query': './src/plugin/@tanstack/vue-query.js',
            '@karrot/plugin': './src/plugin/@karrot/plugin.js',
          },
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

function GenerateImportMap ({ imports: importsOption }) {
  return {
    name: 'karrot:generate-import-map',
    enforce: 'post',
    options (options) {
      // We're just assuming it's a single string input
      const index = options.input

      Object.assign(options, {
        // Need this to ensure we actually output stuff that will get
        // consumed by the things that import stuff, otherwise it gets
        // removed as it doesn't know it's used
        preserveEntrySignatures: 'allow-extension',
        input: {
          index,
          ...importsOption,
        },
      })
    },
    transformIndexHtml (_, { bundle }) {
      const imports = { ...importsOption }
      if (bundle) {
        // Prod mode, convert to bundled name
        for (const dep of Object.keys(imports)) {
          const entry = Object
            .values(bundle)
            .find(entry => entry.type === 'chunk' && entry.name === dep)
          if (!entry) throw new Error('missing bundle entry for ' + dep)
          imports[dep] = './' + entry.fileName
        }
      }
      return [{
        tag: 'script',
        attrs: {
          type: 'importmap',
        },
        children: JSON.stringify({ imports }),
      }]
    },
  }
}
