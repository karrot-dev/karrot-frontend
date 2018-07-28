const prodEnv = require('./prod.env')

module.exports = Object.assign({}, prodEnv, {
  NODE_ENV: '"development"',
  RAVEN_CONFIG: JSON.stringify(process.env.RAVEN_CONFIG || null),
})
