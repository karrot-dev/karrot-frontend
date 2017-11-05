#!/usr/bin/env node
/**
 * Hacky script to compare the messages in locale-en.json with client-side usage
 * Run: scripts/find_unused_locales.js
 *
 * Only handles t('KEY') markers, so it shows a lot of false positives
 */

const { readFileSync } = require('fs')

const data = readFileSync('./src/locales/locale-en.json', 'utf8')
const messages = JSON.parse(data)

let keys = []
function getKeys (src, parent) {
  for (let key in src) {
    let path = key
    if (parent) {
      path = parent + '.' + key
    }
    if (typeof src[key] === 'string') {
      keys.push(path)
    }
    else {
      getKeys(src[key], path)
    }
  }
}
getKeys(messages)

let usages = []
const { exec } = require('child_process')
exec(`grep -hor "[.|$]t[c]*(.*'[a-zA-Z0-9._ ]*'.*)" src/`, (err, stdout, stderr) => {
  if (!err) {
    usages = stdout.split('\n').map(e => e.split("'")[1])
    for (let key of keys) {
      if (!usages.includes(key)) {
        console.log(key)
      }
    }
  }
})
