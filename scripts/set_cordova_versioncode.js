#!/usr/bin/env node

/**
 * Set Cordova config.xml versionCode to a ever increasing number (the git commit count)
 */

const { execSync } = require('child_process')
const CordovaConfig = require('cordova-config')
const { resolve } = require('path')

const path = resolve(__dirname, '../cordova/config.xml')

const commitCount = parseInt(execSync('git rev-list HEAD --count', { encoding: 'utf8' }).split('\n')[0])

// offset number because we started with version 10000 and play store requires ever increasing numbers
const versionCode = commitCount * 10

console.log(`Updating versionCode to ${versionCode} in ${path}`)

const config = new CordovaConfig(path)
config.setAndroidVersionCode(versionCode)
config.writeSync()
