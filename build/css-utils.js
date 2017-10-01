var
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  autoprefixer = require('autoprefixer'),
  purify = require('purify-css'),
  glob = require('glob'),
  path = require('path'),
  fs = require('fs')

module.exports.postcss = [autoprefixer()]

module.exports.styleLoaders = function (options) {
  options = options || {}

  function generateLoaders (loaders) {
    if (options.postcss) {
      loaders.splice(1, 0, {
        loader: 'postcss-loader',
        options: {
          plugins: module.exports.postcss
        }
      })
    }

    var sourceLoader = loaders
    .map(function (loader) {
      if (typeof loader === 'string') {
        return { loader, options: {} }
      }
      return loader
    })
    .map(function (loader) {
      if (options.sourceMap) {
        loader.options.sourceMap = true
      }
      return loader
    })

    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: sourceLoader,
        fallback: 'vue-style-loader'
      })
    }
    else {
      return ['vue-style-loader', ...sourceLoader]
    }
  }

  return {
    css: generateLoaders(['css-loader']),
    less: generateLoaders(['css-loader', 'less-loader']),
    sass: generateLoaders(['css-loader', { loader: 'sass-loader', options: { indentedSyntax: true } } ]),
    scss: generateLoaders(['css-loader', 'sass-loader']),
    styl: generateLoaders(['css-loader', 'stylus-loader']),
    stylus: generateLoaders(['css-loader', 'stylus-loader'])
  }
}

module.exports.styleRules = function (options) {
  var output = []
  var loaders = exports.styleLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

function getSize (size) {
  return (size / 1024).toFixed(2) + 'kb'
}

module.exports.purify = function(cb) {
  var css = glob.sync(path.join(__dirname, '../dist/**/*.css'))
  var js = glob.sync(path.join(__dirname, '../dist/**/*.js'))

  Promise.all(css.map(function (file) {
    return new Promise(function (resolve) {
      console.log('\n Purifying ' + path.relative(path.join(__dirname, '../dist'), file).bold + '...')
      purify(js, [file], {minify: true}, function (purified) {
        var oldSize = fs.statSync(file).size
        fs.writeFileSync(file, purified)
        var newSize = fs.statSync(file).size

        console.log(
          ' * Reduced size by ' + ((1 - newSize / oldSize) * 100).toFixed(2) + '%, from ' +
          getSize(oldSize) + ' to ' + getSize(newSize) + '.'
        )
        resolve()
      })
    })
  }))
  .then(cb)
}
