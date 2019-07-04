const webpackConfig = require('../build/webpack.config')

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = ({ config, mode }) => {
  const dev = mode === 'DEVELOPMENT'

  // Manual merge with our webpack config
  config.module.rules = webpackConfig.module.rules
  config.resolve.modules.push(...webpackConfig.resolve.modules)
  config.resolve.extensions = webpackConfig.resolve.extensions
  Object.assign(config.resolve.alias, webpackConfig.resolve.alias)

  config.plugins.push(
    ...webpackConfig.plugins.filter(plugin => {
      return ['DefinePlugin', 'MiniCssExtractPlugin'].includes(plugin.constructor.name)
    }),
    ...(dev ? [new HardSourceWebpackPlugin()] : []),
  )
  return config
}
