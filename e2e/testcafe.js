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
] : ['chromium'];

(async () => {
  const testcafe = await createTestCafe('localhost')
  const runner = await testcafe.createRunner()
  const failedCount = await runner
    .src(join(__dirname, 'tests.js')) // should pass in test files via args or use some autodiscovery
    .browsers(browsers)
    .screenshots('e2e-screenshots')
    .run({
      debugOnFail: !isCI,
    })

  console.log('Tests failed: ' + failedCount)
  testcafe.close()
  if (failedCount > 0) {
    process.exit(1)
  }
})()
