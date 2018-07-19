/**
 * Serves built files from 'dist', proxies API requests and websockets to backend
 */

const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')
const { join } = require('path')

require('dotenv').config()

const config = require('../config')

/**
 * Serve static files
 */
const app = express()
app.use(express.static(join(__dirname, '../dist')))

const proxyTable = config.dev.proxyTable

Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
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
