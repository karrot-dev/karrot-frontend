#!/usr/bin/env node

// configuration: a function for how you want the keys to be renamed
function renameKey (key) {
  if (/COLLECTOR/.test(key)) {
    return key
      .replace(/COLLECTOR/g, 'PARTICIPANT')
  }
  return key
}

const { readFileSync, writeFileSync } = require('fs')
const { execSync } = require('child_process')
const glob = require('glob')
const _ = require('lodash')

const push = process.argv.includes('--push')
const nopull = process.argv.includes('--nopull')

const en = JSON.parse(readFileSync('./src/locales/locale-en.json', 'utf8'))

const renameKeys = {}
for (const key of getKeys(en)) {
  const newKey = renameKey(key)
  if (newKey !== key) {
    renameKeys[key] = newKey
  }
}

function getKeys (data, path = []) {
  const keys = []
  for (const key of Object.keys(data)) {
    const val = data[key]
    if (_.isPlainObject(val)) {
      keys.push(...getKeys(val, path.concat(key)))
    }
    else {
      keys.push(path.concat(key).join('.'))
    }
  }
  return keys
}

function sortObject (o) {
  const sorted = {}
  const a = []

  for (const key of Object.keys(o)) {
    a.push(key)
  }

  a.sort()

  for (let key = 0; key < a.length; key++) {
    const val = o[a[key]]
    if (_.isPlainObject(val)) {
      sorted[a[key]] = sortObject(val)
    }
    else {
      sorted[a[key]] = val
    }
  }
  return sorted
}

function removeEmptyObjects (o) {
  return Object.entries(o).reduce((acc, [key, val]) => {
    if (_.isPlainObject(val)) {
      if (!_.isEmpty(val)) {
        acc[key] = removeEmptyObjects(val)
      }
    }
    else {
      acc[key] = val
    }
    return acc
  }, {})
}

if (!nopull) {
  console.log('Pulling original messages from transifex...')
  execSync('./updateLocalesHelper/env/bin/tx pull -s --force')

  console.log('Pulling translated messages...')
  execSync('./updateLocalesHelper/env/bin/tx pull --mode onlytranslated --parallel --force')
}

const files = glob.sync('./src/locales/locale-*.json', { absolute: true }).reduce((acc, filename) => {
  acc[filename] = JSON.parse(readFileSync(filename, 'utf8'))
  return acc
}, {})

const sourceFilename = Object.keys(files).find(e => e.includes('locale-en.json'))

/*
Pushing _source_ messages to transifex has PUT semantics:
keys that are not specified will get removed, including translated messages for that key

Pushing _translated_  messages to transifex has PATCH semantics:
every key that's specified will get updated, others will remain

Therefore, we need to push the whole locale-en.json file, but only the rewritten keys in other locale files.

Assuming we want to change

source: {
  originalKey: "asdf"
}
translated: {
  originalKey: "äüö"
}

into

source: {
  changedKey: "asdf"
}
translated: {
  changedKey: "äüö"
}

We first rewrite the files and then push them to transifex together. The translations for "originalKey" will get removed,
but we directly provide translations for "changedKey", thereby keeping messages intact!

*/

// changedFiles contains the full source file and empty objects for each other locale
const changedFiles = _.cloneDeep(files)
for (const key of Object.keys(changedFiles)) {
  if (key === sourceFilename) continue
  changedFiles[key] = {}
}

Object.entries(renameKeys).forEach(([a, b]) => {
  Object.keys(changedFiles).forEach(key => {
    if (key === sourceFilename) {
      const sourceMessages = changedFiles[sourceFilename]
      if (!_.has(sourceMessages, a)) {
        console.log(`Did not find ${a} in ${sourceFilename}!`)
        return
      }
      // rewrite key in changedFiles
      const value = _.get(sourceMessages, a)
      if (typeof value === 'undefined') throw new Error(`key not found: ${a}`)
      _.set(sourceMessages, b, value)
      _.unset(sourceMessages, a)
    }
    else {
      if (!_.has(files[key], a)) {
        console.log(`Did not find ${a} in ${key}!`)
        return
      }
      // copy translation message to new key in changedFiles
      const value = _.get(files[key], a)
      const originalValue = _.get(files[sourceFilename], a)
      if (value !== originalValue) {
        _.set(changedFiles[key], b, value)
      }
    }
  })
})

Object.entries(changedFiles).forEach(([filename, messages]) => {
  writeFileSync(filename, JSON.stringify(sortObject(removeEmptyObjects(messages)), null, 2))
})

if (push) {
  console.log('Pushing changed files...')
  execSync('./updateLocalesHelper/env/bin/tx push -t -s')

  console.log('Pulling all files...')
  execSync('./updateLocalesHelper/env/bin/tx pull --parallel --force')
}
else {
  console.log('Did not push changes, call with --push arg for that')
}

console.log('Done!')
