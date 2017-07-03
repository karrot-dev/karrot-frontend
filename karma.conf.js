let webpackConfig = require("./webpack.config.js");

module.exports = function (config) {
  config.set({
    // base path used to resolve all patterns
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha", "chai", "chai-as-promised", "sinon-chai"],

    // list of files/patterns to load in the browser
    files: [{ pattern: "spec.bundle.js", watched: false }],

    // files to exclude
    exclude: [],

    plugins: [
      require("karma-chai"),
      require("karma-chai-plugins"),
      require("karma-chrome-launcher"),
      require("karma-coverage"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-junit-reporter"),
      require("karma-sourcemap-loader"),
      require("karma-webpack")
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { "spec.bundle.js": ["webpack", "sourcemap"] },

    webpack: {
      devtool: "inline-source-map",
      resolve: webpackConfig.resolve,
      module: {
        rules: webpackConfig.module.rules
      }
    },

    webpackServer: {
      noInfo: true // prevent console spamming when running in Karma!
    },

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["mocha"],

    mochaReporter: {
      // first run will have the full output and the next runs just output the summary and errors in mocha style
      output: "autowatch",
      showDiff: true
    },

    // web server port
    port: 9876,

    // enable colors in the output
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome"],

    // if true, Karma runs tests once and exits
    singleRun: true,

    // Setup the coverage to report lcov
    coverageReporter: {
      type: "lcovonly",
      dir: "coverage/"
    }

  });
};
