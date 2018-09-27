#!/usr/bin/env node

/**
 * Sets app version based on CHANGELOG.md
 *
 * Steps:
 * 1. Update changelog by chaning "Unreleased" to a new version number
 * 2. Run node ./scripts/prepare_release.js
 */

const { parser, Release } = require('keep-a-changelog')
const fs = require('fs')
const { execSync } = require('child_process')
const CordovaConfig = require('cordova-config')

const changelogFilePath = './CHANGELOG.md'
const cordovaConfigPaths = ['./cordova/config/dev/config.xml', './cordova/config/prod/config.xml']

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

// update version in package.json version
// it will create a git tag for that version (and raise an error if version already exists)
console.log('Updating version in package.json and creating tag')
execSync(`yarn version --new-version ${latestVersion}`, { stdio: 'inherit' })
console.log()

const tag = `v${latestVersion}`
console.log(`Pushing tag ${tag} to origin`)
// execSync(`git push origin ${tag}`, { stdio: 'inherit' })
console.log()

cordovaConfigPaths.forEach(path => {
  console.log(`Updating version in ${path}`)

  const config = new CordovaConfig(path)
  config.setVersion(latestVersion.toString())
  config.writeSync()
})
