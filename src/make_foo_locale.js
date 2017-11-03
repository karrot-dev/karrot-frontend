/**
 * Makes a locale that fills all messages with blind text.
 * Useful for interactive testing if all get translated.
 * Untranslated ones will show up with English text, translated ones will have Chinese characters.
 *
 * Rename locale-foo.json into locale-en.json for easy testing
 */

const { readFileSync, writeFileSync } = require('fs')

const data = readFileSync('./src/locales/locale-en.json', 'utf8')
const messages = JSON.parse(data)

function isObject (x) {
  return typeof x === 'object' &&
    x !== null &&
    !(x instanceof RegExp) &&
    !(x instanceof Error) &&
    !(x instanceof Date)
}

function setFoo (val) {
  if (isObject(val)) {
    if (Array.isArray(val)) {
      return val.map(setFoo)
    }
    else {
      let newVal = {}
      for (const key of Object.keys(val)) {
        newVal[key] = setFoo(val[key])
      }
      return newVal
    }
  }
  else {
    return '加入我們的'
  }
}

const foo = JSON.stringify(setFoo(messages), null, 2)

console.log(foo)

writeFileSync('./src/locales/locale-foo.json', foo)
