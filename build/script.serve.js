/**
 * Serves built files from 'dist', proxies API requests and websockets to backend
 */
const { join } = require('path')

const compression = require('compression')
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware').createProxyMiddleware

const { proxyTable } = require('./config')

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

app.listen(8080, () => {
  console.log('listening')
})
