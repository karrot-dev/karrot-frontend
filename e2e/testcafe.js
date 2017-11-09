const createTestCafe = require('testcafe')
const { join } = require('path')
const isCI = process.argv.includes('--ci')
const browsers = isCI ? [
  'saucelabs:Chrome@61:Windows 10',
//  'saucelabs:Firefox@56:Windows 10',
//  'saucelabs:Internet Explorer@11.103:Windows 10',
//  'saucelabs:Safari@11.0:macOS Sierra',
//  'saucelabs:iPhone 7 Simulator@11.0',
//  'saucelabs:iPad 2 Simulator@11.0',
//  'saucelabs:Android Emulator Phone@6.0',
] : ['chromium']

let testcafe = null
let runner = null

createTestCafe('localhost')
  .then(tc => {
    testcafe = tc
    runner = testcafe.createRunner()
  })
  .then(() => {
    return runner
      .src(join(__dirname, 'tests.js')) // should pass in test files via args or use some autodiscovery
      .browsers(browsers)
      .screenshots('e2e-screenshots')
      .run({
        debugOnFail: !isCI,
      })
  })
  .then(failedCount => {
    testcafe.close()
  })
  .catch(err => console.log(err))
