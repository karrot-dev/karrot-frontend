/**
 * Proxies livekit-server, so we can get https in dev
 */

const https = require('https')

const { getExternalNetworkInterface } = require('@quasar/app-vite/lib/helpers/net')
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware').createProxyMiddleware

const { getHttpsOptions } = require('./https')

/**
 * Serve static files
 */
const app = express()

const externalIP = getExternalNetworkInterface()[0].address

console.log('externalIP is', externalIP)

const livekitServerCommand = `livekit-server --dev --bind ${externalIP}`

// TODO: print it properly, or actually run it :)
console.log('livekit command', livekitServerCommand)

app.use(proxyMiddleware({
  target: `http://${externalIP}:7880`,
  ws: true,
}))

/**
 * Run server
 */

const host = externalIP
const httpsPort = 47880
const httpsOptions = getHttpsOptions()
if (typeof httpsOptions !== 'object') {
  throw new Error('invalid http options')
}
https.createServer(httpsOptions, app).listen(httpsPort, host, () => {
  console.log(`listening on https://${host}:${httpsPort}`)
})
