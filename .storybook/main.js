const QuasarConfig = require('@quasar/app/lib/quasar-config')
const getQuasarCtx = require('@quasar/app/lib/helpers/get-quasar-ctx')

module.exports = {
  stories: ['../src/**/*.story.js'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // 'PRODUCTION' is used when building the static version of storybook.

    const ctx = getQuasarCtx({
      mode: 'spa',
      dev: configType === 'DEVELOPMENT',
      prod: configType === 'PRODUCTION'
    })
    const quasarConfig = new QuasarConfig(ctx)
    await quasarConfig.prepare()
    await quasarConfig.compile()
    const webpackConfig = quasarConfig.getWebpackConfig()

    // Manual merge with our webpack config
    config.module.rules = webpackConfig.module.rules
    config.resolve.modules.push(...webpackConfig.resolve.modules)
    config.resolve.extensions = webpackConfig.resolve.extensions
    Object.assign(config.resolve.alias, webpackConfig.resolve.alias)

    config.plugins.push(
      ...webpackConfig.plugins.filter(plugin => {
        return ['DefinePlugin', 'MiniCssExtractPlugin'].includes(plugin.constructor.name)
      }),
    )
    return config
  },
}
