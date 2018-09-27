#!/usr/bin/env node

/**
 * Returns details about newest release from CHANGELOG.md
 */

const { parser } = require('keep-a-changelog')
const fs = require('fs')
const { resolve } = require('path')

const changelogFilePath = resolve(__dirname, '../CHANGELOG.md')

const changelog = parser(fs.readFileSync(changelogFilePath, 'UTF-8'))
const latestRelease = changelog.releases.find(r => r.version)
console.log(latestRelease.toString())
