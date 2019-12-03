let config = {}
if (__ENV.FCM_CONFIG === 'dev') {
  config = require('./firebase.config.dev').default
}
else if (__ENV.FCM_CONFIG === 'prod') {
  config = require('./firebase.config.prod').default
}
export default config
