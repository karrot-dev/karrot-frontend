const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'static/frontendchat'),
    filename: 'app.bundle.js'
  },
  plugins: [new HtmlWebpackPlugin({
      template: './src/index.html'
  })]
};

