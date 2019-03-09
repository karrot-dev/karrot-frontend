import * as Sentry from '@sentry/browser'
import config from '@/base/sentryConfig'

if (__ENV.SENTRY_CONFIG) {
  Sentry.init(config({
    dsn: __ENV.SENTRY_CONFIG,
  }))
}
