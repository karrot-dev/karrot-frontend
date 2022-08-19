#!/usr/bin/env node

/**
 * Returns details about newest release from CHANGELOG.md
 */

const { resolve } = require('path')

const fs = require('fs')
const { parser } = require('keep-a-changelog')

const changelogFilePath = resolve(__dirname, '../CHANGELOG.md')

const changelog = parser(fs.readFileSync(changelogFilePath, 'UTF-8'))
const latestRelease = changelog.releases.find(r => r.version)
console.log(latestRelease.toString())
