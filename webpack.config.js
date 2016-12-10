let path    = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "sourcemap",
  entry: {},
  module: {
    loaders: [
       { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: "ng-annotate!babel" },
       { test: /\.html$/, loader: "raw" },
       { test: /\.styl$/, loader: "style!css?importLoaders=1!postcss!stylus" },
       { test: /\.css$/, loader: "style!css!postcss" },
       { test: /\.(ttf|eot|svg|otf|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file?name=fonts/[name].[ext]" },
       { test: /\.json$/, loader: "json" },
       { test: /\.(png|jpg|jpeg|svg)$/, loader: "file?name=images/[hash].[ext]" }
    ]
  },
  plugins: [
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: "client/index.html",
      inject: "body",
      hash: true
    }),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks (module) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, "client")) === -1;
      }
    })
  ]
};
