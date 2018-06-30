const path = require('path')
const webpack = require('webpack')
const env = require('./env-utils')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: resolve('src/service-worker.js'),
  devtool: false,
  output: {
    path: resolve('dist'),
    filename: 'service-worker.js',
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
      'FCM_SENDER_ID': '"' + env.fcmSenderId + '"',
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      minimize: true,
      compress: {
        warnings: false,
      },
    }),
  ],
}
