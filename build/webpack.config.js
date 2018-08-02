const webpack = require('webpack')
const { resolve, join } = require('path')
const projectRoot = resolve(__dirname, '../')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const dev = process.env.NODE_ENV !== 'production'
const cordova = process.env.CORDOVA === 'true'
const backend = require('./config').backend

const styleLoaders = [
  dev ? 'style-loader' : MiniCssExtractPlugin.loader,
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
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',
  entry: {
    app: './src/main.js',
  },
  output: {
    path: resolve(__dirname, '../dist'),
    publicPath: dev ? '/' : '',
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
          name: '[name].[hash:7].[ext]',
          outputPath: (dev ? '' : '/') + 'assets/images',
          publicPath: cordova && '../images',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]',
          outputPath: (dev ? '' : '/') + 'assets/fonts',
          publicPath: cordova && '../fonts',
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
      // define the karrot environment
      __ENV: {
        DEV: dev,
        CORDOVA: cordova,
        BACKEND: JSON.stringify(backend),
        KARROT_THEME: JSON.stringify(process.env.KARROT_THEME),
        FCM_SENDER_ID: JSON.stringify(process.env.FCM_SENDER_ID),
        RAVEN_CONFIG: JSON.stringify(process.env.RAVEN_CONFIG),
        GIT_SHA1: JSON.stringify(process.env.GIT_SHA1 || process.env.CIRCLE_SHA1),
      },
      // Quasar requires process.env.THEME to be set
      'process.env.THEME': JSON.stringify('mat'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      minify: true,
    }),
    new VueLoaderPlugin(),
    ...(dev ? [] : [
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
    ]),
    new HardSourceWebpackPlugin(),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: !dev,
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
      name: dev,
    },
    runtimeChunk: 'single',
  },
}
