const createTestCafe = require('testcafe')
const { join } = require('path')
const isCI = process.argv.includes('--ci')
const browsers = isCI ? [
  'saucelabs:Chrome@latest-1:Windows 10',
  'saucelabs:Firefox@latest-1:Windows 10',
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
