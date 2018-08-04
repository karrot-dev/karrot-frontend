const path = require('path')
const serveStatic = require('koa-static')
const convert = require('koa-connect')
const mount = require('koa-mount')
const proxy = require('http-proxy-middleware')
const proxyTable = require('./config').proxyTable

const webpackConfig = require('./webpack.config')

const host = process.env.HOST || '127.0.0.1'

module.exports = {
  ...webpackConfig,
  serve: {
    host,
    clipboard: false,
    content: [],
    devMiddleware: {
      publicPath: webpackConfig.output.publicPath,
      stats: 'minimal',
    },
    add: (app, middleware, options) => {
      middleware.webpack()
      for (const prefix of Object.keys(proxyTable)) {
        app.use(convert(proxy(prefix, proxyTable[prefix])))
      }
      const staticsPath = path.posix.join(webpackConfig.output.publicPath, 'statics/')
      app.use(mount(staticsPath, serveStatic('./src/statics')))
    },
  },
}
