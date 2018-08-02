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

const theme = 'mat'

const nodeEnv = {
  dev: process.env.NODE_ENV === 'development',
  prod: process.env.NODE_ENV === 'production',
  cordova: process.env.CORDOVA === 'true',
  karrotTheme: process.env.KARROT_THEME || 'default',
  fcmSenderId: process.env.FCM_SENDER_ID,
  platform: {
    theme: theme,
    cordovaAssets: './cordova/platforms/' + (theme === 'mat' ? 'android' : 'ios') + '/platform_www',
  },
}

const appEnv = {
  NODE_ENV: JSON.stringify('production'),
  RAVEN_CONFIG: JSON.stringify(process.env.RAVEN_CONFIG || 'https://6fd3cc6b432b457e8f18e12aa163a900@sentry.io/236883'),
  GIT_SHA1: JSON.stringify(process.env.GIT_SHA1 || process.env.CIRCLE_SHA1),
  THEME: JSON.stringify(theme),
}

module.exports = {
  backend,
  nodeEnv,
  build: {
    // defines process.env inside app
    appEnv,
  },
  dev: {
    // defines process.env inside app
    env: Object.assign({}, appEnv, {
      NODE_ENV: JSON.stringify('development'),
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
