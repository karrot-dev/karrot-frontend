#!/usr/bin/env node
/**
 * Hacky script to compare the messages in locale-en.json with client-side usage
 * Run: scripts/find_unused_locales.js
 *
 * Obviously it does not handle dynamically composed translation keys, so expect some false positives.
 */

const { readFileSync } = require('fs')

const data = readFileSync('./src/locales/locale-en.json', 'utf8')
const messages = JSON.parse(data)

const keys = []
function getKeys (src, parent) {
  for (const key in src) {
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

const { exec } = require('child_process')
keys.forEach(k => {
  exec(`grep -Fr ${k} src/`, (error) => {
    // error is not null -> probably not found (or some other error occurred)
    if (error) console.log(k)
  })
})
