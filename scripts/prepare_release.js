#!/usr/bin/env node

/**
 * Sets app version based on CHANGELOG.md
 *
 * Steps:
 * 1. Update changelog by chaning "Unreleased" to a new version number
 * 2. Run node ./scripts/prepare_release.js
 * 3. git push
 * 4. Click the "approve" button on https://circleci.com/gh/yunity/workflows/karrot-frontend/tree/master
 */

const { parser, Release } = require('keep-a-changelog')
const fs = require('fs')
const { execSync } = require('child_process')
const CordovaConfig = require('cordova-config')
const { resolve } = require('path')

const changelogFilePath = resolve(__dirname, '../CHANGELOG.md')
const cordovaConfigPaths = [
  resolve(__dirname, '../cordova/config/dev/config.xml'),
  resolve(__dirname, '../cordova/config/prod/config.xml'),
]

// Parse changelog file and get latest release
const changelog = parser(fs.readFileSync(changelogFilePath, 'UTF-8'))
const latestRelease = changelog.releases.find(r => r.version)
const latestVersion = latestRelease.version
console.log('found version', latestVersion.toString())

// Add a new "Unreleased section if there is none
const hasNoUnreleased = !changelog.findRelease()
if (hasNoUnreleased) {
  console.log('Adding empty unreleased section to Changelog')
  changelog.addRelease(new Release())
}

console.log('Writing back changelog.md for consistency')
fs.writeFileSync(changelogFilePath, changelog.toString())

console.log('Updating version in package.json')
execSync(`yarn version --new-version ${latestVersion} --no-git-tag-version`, { stdio: 'inherit' })
console.log()

cordovaConfigPaths.forEach(path => {
  console.log(`Updating version in ${path}`)

  const config = new CordovaConfig(path)
  config.setVersion(latestVersion.toString())
  config.writeSync()
})

const tag = `v${latestVersion}`
console.log('Committing all changes')
execSync(`git commit -am "${tag}"`, { stdio: 'inherit' })
execSync('git pull', { stdio: 'inherit' })

console.log(`Creating tag ${tag}`)
execSync(`git tag ${tag}`, { stdio: 'inherit' })

console.log(`Pushing tag ${tag} to origin`)
execSync(`git push origin ${tag}`, { stdio: 'inherit' })
console.log()
