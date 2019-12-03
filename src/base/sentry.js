import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

if (__ENV.SENTRY_CONFIG) {
  Sentry.init({
    dsn: __ENV.SENTRY_CONFIG,
    integrations: [
      new Integrations.Vue({ Vue, logErrors: true }),
      new Integrations.ExtraErrorData(),
    ],
    release: __ENV.GIT_SHA1,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded', // Chrome
      'ResizeObserver loop completed with undelivered notifications', // Firefox
    ],
  })
}
