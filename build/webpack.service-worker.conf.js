const path = require('path')
const webpack = require('webpack')

const TerserPlugin = require('terser-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: 'production',
  entry: resolve('src/subscriptions/service-worker.js'),
  devtool: false,
  output: {
    path: resolve('dist'),
    filename: 'service-worker.js',
  },
  node: {
    global: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      '__ENV.FCM_CONFIG': JSON.stringify(process.env.FCM_CONFIG),
    }),
    new TerserPlugin({
      sourceMap: false,
    }),
  ],
}
