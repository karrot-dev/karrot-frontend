var path = require('path')

const BACKEND = 'https://dev.foodsaving.world/'

module.exports = {
  // Webpack aliases
  aliases: {
    quasar: path.resolve(__dirname, '../node_modules/quasar-framework/'),
    '@': path.resolve(__dirname, '../src'),
    variables: path.resolve(__dirname, '../src/themes/quasar.variables.styl')
  },

  // Progress Bar Webpack plugin format
  // https://github.com/clessg/progress-bar-webpack-plugin#options
  progressFormat: ' [:bar] ' + ':percent'.bold + ' (:msg)',

  // Default theme to build with ('ios' or 'mat')
  defaultTheme: 'mat',

  build: {
    env: require('./prod.env'),
    publicPath: '',
    productionSourceMap: false,

    // Remove unused CSS
    // Disable it if it has side-effects for your specific app
    purifyCSS: true
  },
  dev: {
    env: require('./dev.env'),
    cssSourceMap: true,
    // auto open browser or not
    openBrowser: true,
    publicPath: '/',
    port: 8080,

    // If for example you are using Quasar Play
    // to generate a QR code then on each dev (re)compilation
    // you need to avoid clearing out the console, so set this
    // to "false", otherwise you can set it to "true" to always
    // have only the messages regarding your last (re)compilation.
    clearConsoleOnRebuild: false,

    // Proxy your API if using any.
    // Also see /build/script.dev.js and search for "proxy api requests"
    // https://github.com/chimurai/http-proxy-middleware
    proxyTable: {
      '/api': {
        target: BACKEND,
        changeOrigin: true,
        onProxyReq: (proxyReq) => {
          if (/^https:/.test(BACKEND)) {
            // For secure backends we must set the referer to make django happy
            // https://github.com/django/django/blob/master/django/middleware/csrf.py#L226
            // If the backend tries to use this referer for anything useful it will break
            // as it is a blatant lie, but I don't think it does...
            proxyReq.setHeader("referer", BACKEND);
          }
        }
      }
    }
  }
}

/*
 * proxyTable example:
 *
   proxyTable: {
      // proxy all requests starting with /api
      '/api': {
        target: 'https://some.address.com/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
 */
