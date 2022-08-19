/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */

const { resolve } = require('path')

const ESLintPlugin = require('eslint-webpack-plugin')
const { readFileSync, existsSync } = require('fs')
// const StyleLintPlugin = require('stylelint-webpack-plugin') TODO?
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const { configure } = require('quasar/wrappers')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const webpackAliases = require('./webpack.aliases').resolve.alias

function getHttpsOptions () {
  /* Try to set up https with your own cert for usage with mkcert
  Define your cert path and filenames in a file called .env (this uses dotenv)

  KEY=key.pem
  CERT=cert.pem
  CA=/home/tic/.local/share/mkcert/rootCA.pem

  More info: https://github.com/FiloSottile/mkcert
  If these are not available, fall back to making our own cert
  */
  const keyFilename = process.env.KEY || resolve(__dirname, './build/dev-certs/key.pem')
  const certFilename = process.env.CERT || resolve(__dirname, './build/dev-certs/cert.pem')
  const caFilename = process.env.CA || resolve(__dirname, './build/dev-certs/ca.pem')
  const all = [keyFilename, certFilename, caFilename]
  const missing = all.filter(filename => !existsSync(filename))
  if (missing.length > 0) {
    console.log(`Could not find key/cert/ca files ${missing.join(', ')}, falling back to our own...`)
    return true
  }
  console.log('Using key/cert/ca files', all.join(', '))
  return {
    key: readFileSync(keyFilename),
    cert: readFileSync(certFilename),
    ca: readFileSync(caFilename),
  }
}

module.exports = configure(function (ctx) {
  const { backend, proxyTable } = require('./build/config')
  const dev = ctx.dev

  const appEnv = {
    // define the karrot environment
    KARROT: {
      BACKEND: backend,
      THEME: process.env.KARROT_THEME,
      GIT_SHA1: process.env.GIT_SHA1 || process.env.CIRCLE_SHA1,
    },
  }

  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/quasar-conf-js#property-htmlvariables
    htmlVariables: {
      title: 'Karrot - Start a group, become a community',
    },

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // https://quasar.dev/quasar-cli/boot-files
    boot: [
      'compat',
      'vue-query',
      'loglevel',
      'pwa',
      'helloDeveloper',
      'addressbar-color',
      'socket',
      'cordova',
      'i18n',
      'loadInitialData',
      'polyfill',
      'icons',
      'detectMobileKeyboard',
      'performance',
      'presenceReporter',
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.sass',
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      // 'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // disable vendor chunk
    vendor: {
      disable: true,
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: false, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      env: appEnv,

      sourceMap: true,

      // https://quasar.dev/quasar-cli/handling-webpack
      chainWebpack (chain) {
        const imagesRule = chain.module.rule('images')
        // save loader options from quasar - returns an object like this:
        /*
        {
          esModule: false,
          limit: 10000,
          name: 'img/[name].[ext]',
        }
        */
        const imagesRuleOptions = imagesRule.uses.entries()['url-loader'].store.get('options')

        // clear all existing loaders.
        // if you don't do this, the loader below will be appended to
        // existing loaders of the rule.
        imagesRule.uses.clear()

        /* eslint-disable indent */
        imagesRule
          .oneOf('disableinline')
            .resourceQuery(/disableinline/)
            .use('url-loader')
              .loader('url-loader')
              .options({ ...imagesRuleOptions, limit: -1 })
              .end()
            .end()
          .oneOf('inline') // aka default from quasar
            .use('url-loader')
              .loader('url-loader')
              .options(imagesRuleOptions)
        /* eslint-enable indent */
      },

      // for compatibility with vue-croppa
      // can be deleted once vue-croppa supports vue 3 or we don't use it anymore
      // see https://github.com/zhanziyang/vue-croppa/issues/235
      // also check src/boot/compat.js
      vueLoaderOptions: {
        compilerOptions: {
          compatConfig: {
            MODE: 3,
          },
        },
      },

      extendWebpack (cfg) {
        cfg.plugins.push(new ESLintPlugin())

        cfg.resolve.alias = {
          ...cfg.resolve.alias, // This adds the existing alias
          ...webpackAliases, // from webpack.aliases.js
        }

        cfg.plugins.push(
          new PreloadWebpackPlugin({
            fileWhitelist: [/\.woff?$/],
            include: 'allAssets',
            rel: 'prefetch',
          }),
        )

        if (!dev) {
          cfg.plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: ctx.mode.cordova ? 'disabled' : 'static',
            reportFilename: 'bundlesize.html',
            defaultSizes: 'gzip',
            openAnalyzer: false,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info',
          }))
        }
      },
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      // PWA needs https to load the service worker
      https: (ctx.dev && ctx.mode.pwa) ? getHttpsOptions() : false,
      port: 8080,
      open: !process.env.NO_OPEN_BROWSER, // opens browser window automatically
      proxy: proxyTable,
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'en-US', // Quasar language pack
      config: {},

      // Quasar plugins
      plugins: [
        'Dialog',
        'AppVisibility',
        'Notify',
        'AddressbarColor',
      ],
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
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
      extendWebpackCustomSW (cfg) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          '@': resolve(__dirname, './src'),
        }
      },
      manifest: {
        name: process.env.PWA_APP_NAME || 'Karrot local dev',
        short_name: process.env.PWA_APP_NAME || 'Karrot local dev',
        description: 'Modern website for organization of foodsaving groups worldwide',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#4a3520',
        icons: process.env.KARROT_THEME === 'dev'
          ? [
              {
                src: 'icons/dev.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: 'icons/dev.svg',
              },
            ]
          : [
              {
                src: 'icons/icon-128x128.png',
                sizes: '128x128',
                type: 'image/png',
              },
              {
                src: 'icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'icons/icon-256x256.png',
                sizes: '256x256',
                type: 'image/png',
              },
              {
                src: 'icons/icon-384x384.png',
                sizes: '384x384',
                type: 'image/png',
              },
              {
                src: 'icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
      },
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },
  }
})
