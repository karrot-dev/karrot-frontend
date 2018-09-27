#!/usr/bin/env node

/**
 * Set Cordova config.xml versionCode to a monotonically increasing value (the git commit count)
 */

const { execSync } = require('child_process')
const CordovaConfig = require('cordova-config')
const { resolve } = require('path')

const path = resolve(__dirname, '../cordova/config.xml')

const commitCount = parseInt(execSync('git rev-list HEAD --count', { encoding: 'utf8' }).split('\n')[0])

console.log(`Updating versionCode to ${commitCount} in ${path}`)

const config = new CordovaConfig(path)
config.setAndroidVersionCode(commitCount)
config.writeSync()
