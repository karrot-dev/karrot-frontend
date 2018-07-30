const webpack = require('webpack')
const { resolve, join } = require('path')
const config = require('./config')
const env = require('./env-utils')
const projectRoot = resolve(__dirname, '../')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const styleLoaders = [
  env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
  {
    loader: 'css-loader',
    options: { importLoaders: 1 },
  },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: loader => [
        require('autoprefixer')(),
      ],
    },
  },
]

module.exports = {
  mode: env.prod ? 'production' : 'development',
  devtool: env.prod ? 'source-map' : 'cheap-module-eval-source-map',
  entry: {
    app: './src/main.js',
  },
  output: {
    path: resolve(__dirname, '../dist'),
    publicPath: env.prod ? '' : '/',
    filename: 'assets/js/[name].[hash].js',
    chunkFilename: 'assets/js/[id].[chunkhash].js',
    pathinfo: false,
  },
  resolve: {
    extensions: [
      '.mat.js', // for use inside quasar
      '.js',
      '.vue',
      '.json',
    ],
    modules: [
      resolve('src'),
      resolve('node_modules'),
    ],
    alias: {
      quasar: 'quasar-framework',
      'quasar-vue-plugin': 'quasar-framework/src/vue-plugin',
      '@': resolve(__dirname, '../src'),
      '>': resolve(__dirname, '../test'),
      variables: resolve(__dirname, '../src/themes/quasar.variables.styl'),
      slidetoggle: resolve(__dirname, '../src/themes/karrot.slidetoggle.styl'),
      editbox: resolve(__dirname, '../src/themes/karrot.editbox.styl'),
    },
    symlinks: false,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        include: projectRoot,
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          join(projectRoot, 'src'),
          /quasar\//,
        ],
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules)/,
        use: 'vue-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '/assets/images/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '/assets/fonts/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: styleLoaders,
      },
      {
        test: /\.(stylus|styl)$/,
        use: [
          ...styleLoaders,
          'stylus-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config[env.prod ? 'build' : 'dev'].env,
      'DEV': env.dev,
      'PROD': env.prod,
      'CORDOVA': env.cordova,
      'BACKEND': '"' + config.backend + '"',
      'KARROT_THEME': '"' + env.karrotTheme + '"',
      'FCM_SENDER_ID': '"' + env.fcmSenderId + '"',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      minify: true,
    }),
    new VueLoaderPlugin(),
    ...(env.prod ? [
      new MiniCssExtractPlugin({
        filename: 'assets/css/[contenthash].css',
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundlesize.html',
        defaultSizes: 'gzip',
        openAnalyzer: false,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info',
      }),
    ] : []),
    new HardSourceWebpackPlugin(),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: env.prod,
        cache: true,
        parallel: true,
        uglifyOptions: {
          mangle: true,
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
      minChunks: 2,
      name: !env.prod,
    },
    runtimeChunk: 'single',
  },
}
