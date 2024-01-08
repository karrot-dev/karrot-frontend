/**
 * Proxies livekit-server, so we can get https in dev
 */

const https = require('https')

const express = require('express')
const proxyMiddleware = require('http-proxy-middleware').createProxyMiddleware

const { getHttpsOptions } = require('./https')

/**
 * Serve static files
 */
const app = express()

app.use(proxyMiddleware({
  // This is valid if running `livekit-server --dev`
  target: 'http://127.0.0.1:7880',
  ws: true,
}))

/**
 * Run server
 */

const host = '0.0.0.0'
const httpsPort = 47880
const httpsOptions = getHttpsOptions()
if (typeof httpsOptions !== 'object') {
  throw new Error('invalid http options')
}
https.createServer(httpsOptions, app).listen(httpsPort, host, () => {
  console.log(`listening on https://${host}:${httpsPort}`)
})
