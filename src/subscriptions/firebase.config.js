let config = {}
if (process.env.KARROT.FCM_CONFIG === 'dev') {
  config = require('./firebase.config.dev').default
}
else if (process.env.KARROT.FCM_CONFIG === 'prod') {
  config = require('./firebase.config.prod').default
}
export default config
