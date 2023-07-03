/**
 * Serves built files from 'dist', proxies API requests and websockets to backend
 */

const https = require('https')
const { join } = require('path')

const compression = require('compression')
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware').createProxyMiddleware

const { proxyTable } = require('./config')
const { getHttpsOptions } = require('./https')

/**
 * Serve static files
 */
const app = express()
app.use(compression())
app.use(express.static(join(__dirname, '../dist/pwa')))

Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

/**
 * Run server
 */

if (process.argv.includes('--https')) {
  const httpsPort = 8086
  const httpsOptions = getHttpsOptions()
  if (typeof httpsOptions !== 'object') {
    throw new Error('invalid http options')
  }
  https.createServer(httpsOptions, app).listen(httpsPort, () => {
    console.log(`listening on https://localhost:${httpsPort}`)
  })
}
else {
  const httpPort = 8080
  app.listen(httpPort, () => {
    console.log(`listening at http://localhost:${httpPort}`)
  })
}
