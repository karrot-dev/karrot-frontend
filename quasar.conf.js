/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */

const { configure } = require('quasar/wrappers')
const { resolve } = require('path')
const fs = require('fs')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function getHttpsOptions () {
  /* Try to set up https with your own cert for usage with mkcert
  Define your cert path and filenames in a file called .env (this uses dotenv)

  KEY=key.pem
  CERT=cert.pem
  CA=/home/tic/.local/share/mkcert/rootCA.pem

  More info: https://github.com/FiloSottile/mkcert
  If these are not available, fall back to making our own cert
  */
  try {
    return {
      key: fs.readFileSync(process.env.KEY),
      cert: fs.readFileSync(process.env.CERT),
      ca: fs.readFileSync(process.env.CA),
    }
  }
  catch (e) {
    console.log('Could not find key/cert/ca files, falling back to our own...', e)
    return true
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
      FCM_CONFIG: process.env.FCM_CONFIG,
      SENTRY_CONFIG: process.env.SENTRY_CONFIG,
      GIT_SHA1: process.env.GIT_SHA1 || process.env.CIRCLE_SHA1,
    },
    // vuelidate wants this
    // see https://github.com/monterail/vuelidate/issues/365
    BUILD: JSON.stringify('web'),
  }

  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // https://quasar.dev/quasar-cli/boot-files
    boot: [
      'loglevel',
      'pwa',
      'helloDeveloper',
      'addressbar-color',
      'socket',
      'sentry',
      'cordova',
      'i18n',
      'loadInitialData',
      'polyfill',
      'icons',
      'detectMobileKeyboard',
      'performance',
      'presenceReporter',
      'vuex-router-sync',
      'vueRoot',
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.styl',
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // disable vendor chunk
    vendor: {
      disable: true,
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'hash', // available values: 'hash', 'history'

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

      // https://quasar.dev/quasar-cli/handling-webpack
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
        })

        cfg.resolve.alias = {
          ...cfg.resolve.alias, // This adds the existing alias

          // Add your own alias like this
          '@': resolve(__dirname, './src'),
          '>': resolve(__dirname, './test'),
          variables: resolve(__dirname, './src/css/quasar.variables.styl'),
          editbox: resolve(__dirname, './src/css/karrot.editbox.styl'),
        }

        cfg.plugins.unshift(new StyleLintPlugin({
          files: ['./src/**/*.{vue,styl}'],
          customSyntax: resolve(__dirname, './build/stylelintCustomSyntax.js'),
        }))

        cfg.plugins.push(
          new PreloadWebpackPlugin({
            fileWhitelist: [/\.woff?$/],
            include: 'allAssets',
            rel: 'prefetch',
          }),
        )

        if (dev) {
          cfg.plugins.push(new HardSourceWebpackPlugin({
            configHash: function (webpackConfig) {
              return require('node-object-hash')({ sort: false }).hash([
                webpackConfig,
                appEnv,
              ])
            },
          }))
        }

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
      open: true, // opens browser window automatically
      proxy: proxyTable,
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'en-us', // Quasar language pack
      config: {},

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

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
      workboxPluginMode: 'InjectManifest', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: 'Karrot',
        short_name: 'Karrot',
        description: 'Modern website for organization of foodsaving groups worldwide',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#4a3520',
        icons: [
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
        'related_applications': [
          {
            'platform': 'play',
            'url': 'https://play.google.com/store/apps/details?id=com.example.app1',
            'id': 'com.example.app1',
            'min_version': '2',
            'fingerprints': [
              {
                'type': 'sha256_cert',
                'value': '92:5A:39:05:C5:B9:EA:BC:71:48:5F:F2'
              },
            ],
          },
          {
            'platform': 'webapp',
            'url': 'https://localhost:8080/manifest.json',
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
