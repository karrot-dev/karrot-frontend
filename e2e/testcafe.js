const createTestCafe = require('testcafe')
const { join } = require('path')

let testcafe = null
let runner = null

createTestCafe('localhost')
  .then(tc => {
    testcafe = tc
    runner = testcafe.createRunner()
  })
  .then(() => {
    return runner
      .src(join(__dirname, 'tests.js'))
      .browsers('chromium')
      .run()
  })
  .then(failedCount => {
    testcafe.close()
  })
  .catch(err => console.log(err))
