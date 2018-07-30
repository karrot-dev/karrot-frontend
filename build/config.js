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

const theme = require('./env-utils').platform.theme

const env = {
  NODE_ENV: '"production"',
  RAVEN_CONFIG: JSON.stringify(process.env.RAVEN_CONFIG || 'https://6fd3cc6b432b457e8f18e12aa163a900@sentry.io/236883'),
  GIT_SHA1: JSON.stringify(process.env.GIT_SHA1 || process.env.CIRCLE_SHA1),
  THEME: JSON.stringify(theme),
}

module.exports = {
  backend,

  build: {
    // defines process.env inside app
    env,
  },
  dev: {
    // defines process.env inside app
    env: Object.assign({}, env, {
      NODE_ENV: '"development"',
      RAVEN_CONFIG: JSON.stringify(process.env.RAVEN_CONFIG || null),
    }),
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
