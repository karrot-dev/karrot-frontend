const genDefaultConfig = require('@storybook/vue/dist/server/config/defaults/webpack.config.js')
const merge = require('webpack-merge')

module.exports = (baseConfig, env) => {

  /* when building with storybook we do not want to extract css as we normally do in production */
  process.env.DISABLE_EXTRACT_CSS = true

  const storybookConfig = genDefaultConfig(baseConfig, env)
  const quasarConfig = require('../build/webpack.dev.conf.js')
  const quasarBasePlugins = require('../build/webpack.base.conf.js').plugins

  // use Quasar config as default
  let mergedConfig = merge(quasarConfig, storybookConfig)

  // set Storybook entrypoint
  mergedConfig.entry = storybookConfig.entry

  // allow relative module resolution as used in Storybook
  mergedConfig.resolve.modules = storybookConfig.resolve.modules

  // only use Quasars loaders
  mergedConfig.module.rules = quasarConfig.module.rules

  // enable Storybook http server
  mergedConfig.plugins = storybookConfig.plugins
  // get Quasar's DefinePlugin and PostCSS settings
  mergedConfig.plugins.unshift(quasarBasePlugins[0], quasarBasePlugins[1])

  return mergedConfig
}

