var path = require('path')

const backend = (process.env.BACKEND || 'https://dev.karrot.world').replace(/\/$/, '') // no trailing slash

const backendProxy = {
  target: backend,

  // If we are proxying to an https:// backend we need to change the origin to the target
  // domain so that we make the request with the correct hostname
  // However, when we are running inside docker the backend is not accessible from the client
  // so we need to use the origin origin (localhost).
  changeOrigin: /^https:/.test(backend),
  ws: true,
  onProxyReq: (proxyReq) => {
    if (/^https:/.test(backend)) {
      // For secure backends we must set the referer to make django happy
      // https://github.com/django/django/blob/master/django/middleware/csrf.py#L226
      // If the backend tries to use this referer for anything useful it will break
      // as it is a blatant lie, but I don't think it does...
      proxyReq.setHeader('referer', backend)
    }
  },
  onProxyReqWs: (proxyReq) => {
    proxyReq.setHeader('origin', backend)
  },
}

module.exports = {
  // Webpack aliases
  aliases: {
    quasar: 'quasar-framework',
    'quasar-vue-plugin': 'quasar-framework/src/vue-plugin',
    '@': path.resolve(__dirname, '../src'),
    '>': path.resolve(__dirname, '../test'),
    variables: path.resolve(__dirname, '../src/themes/quasar.variables.styl'),
    slidetoggle: path.resolve(__dirname, '../src/themes/karrot.slidetoggle.styl'),
    editbox: path.resolve(__dirname, '../src/themes/karrot.editbox.styl'),
  },

  // Backend to make API requests to
  backend,

  build: {
    env: require('./prod.env'),
    publicPath: '',
    productionSourceMap: true,
  },
  dev: {
    env: require('./dev.env'),
    publicPath: '/',
    proxyTable: {
      '/api': backendProxy,
      '/media': backendProxy,
      '/community_proxy': {
        target: 'https://dev.karrot.world',
        changeOrigin: true,
      },
    },
  },
}
