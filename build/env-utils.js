const config = require('../config')
const theme = 'mat'

module.exports = {
  dev: process.env.NODE_ENV === 'development',
  prod: process.env.NODE_ENV === 'production',
  cordova: process.env.CORDOVA === 'true',
  karrotTheme: process.env.KARROT_THEME || 'default',
  fcmSenderId: process.env.FCM_SENDER_ID,
  platform: {
    theme: theme,
    cordovaAssets: './cordova/platforms/' + (theme === 'mat' ? 'android' : 'ios') + '/platform_www'
  }
}
