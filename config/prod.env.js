module.exports = {
  NODE_ENV: '"production"',
  RAVEN_CONFIG: JSON.stringify(process.env.RAVEN_CONFIG || 'https://6fd3cc6b432b457e8f18e12aa163a900@sentry.io/236883'),
  GIT_SHA1: JSON.stringify(process.env.GIT_SHA1 || process.env.CIRCLE_SHA1),
}
