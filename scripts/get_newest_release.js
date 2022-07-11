#!/usr/bin/env node

// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
