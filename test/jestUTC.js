/**
* Runs jest with time zone set to UTC, to have the same environment for all devs and circleci
*/
process.env.TZ = 'UTC'

if (process.env.NODE_ENV == null) {
  process.env.NODE_ENV = 'test'
}

require('jest').run()
