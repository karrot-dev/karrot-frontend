
import config from '@/base/sentryConfig'

if (__ENV.SENTRY_APP_CONFIG) {
  document.addEventListener('deviceready', onDeviceReady, false)

  function onDeviceReady () {
    const Sentry = cordova.require('sentry-cordova.Sentry')
    Sentry.init(config({
      dsn: __ENV.SENTRY_APP_CONFIG,
    }))
  }
}
