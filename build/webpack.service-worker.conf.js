const path = require('path')
const webpack = require('webpack')
const env = require('./env-utils')

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: 'production',
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
    new UglifyJsPlugin({
      sourceMap: false,
    }),
  ],
}
