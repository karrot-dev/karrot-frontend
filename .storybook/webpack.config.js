// const genDefaultConfig = require('@storybook/vue/dist/server/config/defaults/webpack.config.js')
// const merge = require('webpack-merge')

const webpack = require('webpack')

const webpackConfig = require('../build/webpack.config')
const config = require('../config')
const env = require('../build/env-utils')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = (baseConfig, storybookEnv) => {
  // Manual merge with our webpack config
  baseConfig.module.rules = webpackConfig.module.rules
  baseConfig.resolve.modules.push(...webpackConfig.resolve.modules)
  baseConfig.resolve.extensions = webpackConfig.resolve.extensions
  Object.assign(baseConfig.resolve.alias, webpackConfig.resolve.alias)

  const definePlugins = webpackConfig.plugins.filter(plugin => {
    return plugin.constructor.name === 'DefinePlugin'
  })

  baseConfig.plugins.push(
    ...definePlugins,
    new VueLoaderPlugin(),
    new HardSourceWebpackPlugin(),
  )
  return baseConfig
}
