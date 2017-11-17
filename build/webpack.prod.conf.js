var
  path = require('path'),
  config = require('../config'),
  cssUtils = require('./css-utils'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  baseWebpackConfig = require('./webpack.base.conf'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'),
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: cssUtils.styleRules({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      postcss: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundlesize.html',
      defaultSizes: 'gzip',
      openAnalyzer: false,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      // Options for `stats.toJson()` method.
      // For example you can exclude sources of your modules from stats file with `source: false` option.
      // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      statsOptions: null,
      // Log level. Can be 'info', 'warn', 'error' or 'silent'.
      logLevel: 'info'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: config.build.productionSourceMap,
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'src/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          (
            module.resource.indexOf('quasar') > -1 ||
            module.resource.indexOf(
              path.join(__dirname, '../node_modules')
            ) === 0
          )
        )
      }
    }),

    // Do some cool async chunk children commons loading async shit #awesome #yolo
    // See:
    //   https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    //   https://medium.com/webpack/webpack-bits-getting-the-most-out-of-the-commonschunkplugin-ab389e5f318
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true,
      minChunks: 3,
    }),

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),

    // do scope hoisting: https://webpack.js.org/plugins/module-concatenation-plugin
    // should reduce scripting time and bundle size
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
})
