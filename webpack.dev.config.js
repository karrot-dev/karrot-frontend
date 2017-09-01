let webpack = require("webpack");
let path    = require("path");
let config  = require("./webpack.config");

config.output = {
  filename: "[name].bundle.js",
  publicPath: "/",
  path: path.resolve(__dirname, "client")
};

config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    CORDOVA: false
  }),

  // Adds webpack HMR support. It act's like livereload,
  // reloading page after webpack rebuilt modules.
  // It also updates stylesheets and inline assets without page reloading.
  new webpack.HotModuleReplacementPlugin()
]);

module.exports = config;
