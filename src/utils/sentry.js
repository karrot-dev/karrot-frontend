import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

export function configureSentry ({ dsn, environment }) {
  if (process.env.DEV) {
    environment = 'dev'
  }
  Sentry.init({
    dsn,
    environment,
    integrations: [
      new Integrations.Vue({ Vue, logErrors: true }),
      new Integrations.ExtraErrorData(),
    ],
    release: process.env.KARROT.GIT_SHA1,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded', // Chrome
      'ResizeObserver loop completed with undelivered notifications', // Firefox
    ],
  })
}
