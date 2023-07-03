require('dotenv').config()

const execSync = require('child_process').execSync

const backend = (process.env.BACKEND || 'https://dev.karrot.world').replace(/\/$/, '') // no trailing slash

const backendProxy = {
  target: backend,

  // If we are proxying to an https:// backend we need to change the origin to the target
  // domain so that we make the request with the correct hostname
  // However, when we are running inside docker the backend is not accessible from the client
  // so we need to use the origin origin (localhost).
  changeOrigin: /^https:/.test(backend),
  ws: true,
  // This is needed if using https in local dev, so we give image URLS the right host
  xfwd: true,
  // The proxy thing inside vite needs this way to configure the events
  configure (proxy) {
    proxy.on('proxyReq', onProxyReq)
    proxy.on('proxyReqWs', onProxyReqWs)
    proxy.on('proxyRes', onProxyRes)
  },
  // Where http-proxy-middleware (used in our yarn serve command), wants it like this
  onProxyReq,
  onProxyReqWs,
  onProxyRes,
}

module.exports = {
  backend,
  proxyTable: {
    '/api': backendProxy,
    '/media': backendProxy,
    '/community_proxy': {
      target: 'https://dev.karrot.world',
      changeOrigin: true,
    },
    '/about.json': backendProxy,
  },
}

function getLocalAboutJSON () {
  return {
    commitSHA: run('git rev-parse HEAD'),
    commitSHAShort: run('git rev-parse --short HEAD'),
    ref: run('git rev-parse --abbrev-ref HEAD'),
    env: 'local',
    apkURL: null,
    date: new Date().toISOString().replace(/T.*/, ''),
  }
}

function onProxyRes (proxyRes, req, res) {
  if (req.url === '/about.json' && proxyRes.statusCode !== 200) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })
    return res.end(JSON.stringify(getLocalAboutJSON()))
  }
}

function onProxyReq (proxyReq) {
  console.log('Proxy', proxyReq.path)
  proxyReq.setHeader('origin', backend)
  // We generate a local one on the fly
  // Have a look at https://dev.karrot.world/about.json to see what it should contain
  if (/^https:/.test(backend)) {
    // For secure backends we must set the referer to make django happy
    // https://github.com/django/django/blob/master/django/middleware/csrf.py#L226
    // If the backend tries to use this referer for anything useful it will break
    // as it is a blatant lie, but I don't think it does...
    proxyReq.setHeader('referer', backend)
  }
  if (process.env.FAKE_IP_FOR_BACKEND) {
    // This let's you set an IP address that will be used for geoip in the backend
    // Otherwise it'll be 127.0.0.1 and it won't find a location for it
    proxyReq.setHeader('x-forwarded-for', process.env.FAKE_IP_FOR_BACKEND)
  }
}

function onProxyReqWs (proxyReq) {
  proxyReq.setHeader('origin', backend)
}

function run (cmd) {
  try {
    return execSync(cmd).toString().trim()
  }
  catch (error) {
    return null
  }
}
