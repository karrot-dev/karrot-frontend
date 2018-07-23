const path = require('path')
const static = require('koa-static')
const convert = require('koa-connect')
const mount = require('koa-mount')
const proxy = require('http-proxy-middleware')
const config = require('../config')

const webpackConfig = require('./webpack.config')

const host = process.env.HOST || '127.0.0.1'

module.exports = {
  ...webpackConfig,
  serve: {
    host,
    clipboard: false,
    content: [],
    dev: {
      publicPath: webpackConfig.output.publicPath,
      stats: 'minimal'
    },
    add: (app, middleware, options) => {
      middleware.webpack()
      for (const prefix of Object.keys(config.dev.proxyTable)) {
        app.use(convert(proxy(prefix, config.dev.proxyTable[prefix])))
      }
      const staticsPath = path.posix.join(webpackConfig.output.publicPath, 'statics/')
      app.use(mount(staticsPath, static('./src/statics')))
    }
  }
}
