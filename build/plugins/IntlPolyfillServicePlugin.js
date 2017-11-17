const { readFileSync } = require('fs')
const { ConcatSource } = require('webpack-sources')

const checkIntlPolyfillSource = readFileSync(require.resolve('./checkIntlPolyfill'), { encoding: 'utf8' }).trimRight()

/**
 *   A simpler version of https://github.com/SebastianS90/webpack-polyfill-injector that only cares about Intl
 */
class IntlPolyfillServicePlugin {
  apply (compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
        chunks.forEach((chunk) => {
          if (!chunk.hasEntryModule()) return
          chunk.files.forEach(file => {
            if (!file.endsWith('.js') ||
              compilation.assets[file].__IntlPolyfillServicePlugin
            ) return
            this.processFile(compilation, file)
          })
        })
        callback()
      })
    })
  }

  processFile (compilation, file) {
    const source = new ConcatSource(
      checkIntlPolyfillSource,
      '(function () {',
      compilation.assets[file],
      '})',
    )
    source.__IntlPolyfillServicePlugin = true
    compilation.assets[file] = source
  }
}

module.exports = IntlPolyfillServicePlugin
