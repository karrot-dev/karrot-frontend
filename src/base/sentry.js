import Vue from 'vue'
import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: __ENV.SENTRY_CONFIG,
  integrations: [new Sentry.Integrations.Vue({ Vue })],
  release: __ENV.GIT_SHA1,
  beforeSend: event => {
    const { message } = event
    if (message && message.includes('ResizeObserver loop limit exceeded')) {
      return null
    }
    return event
  },
})
