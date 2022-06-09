import * as Sentry from '@sentry/vue'

export function configureSentry (app, { dsn, environment }) {
  if (process.env.DEV) {
    environment = 'dev'
  }
  Sentry.init({
    app,
    dsn,
    environment,
    release: process.env.KARROT.GIT_SHA1,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded', // Chrome
      'ResizeObserver loop completed with undelivered notifications', // Firefox
    ],
  })
}
