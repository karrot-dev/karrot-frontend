var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  RAVEN_CONFIG: JSON.stringify(process.env.RAVEN_CONFIG || null),
})
