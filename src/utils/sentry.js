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

    // Disable sentry session tracking
    // See https://docs.sentry.io/platforms/javascript/configuration/releases/?original_referrer=https%3A%2F%2Fwww.startpage.com%2F#sessions
    // and https://community.karrot.world/t/sending-too-much-data-to-sentry/1194
    autoSessionTracking: false,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded', // Chrome
      'ResizeObserver loop completed with undelivered notifications', // Firefox
    ],
  })
}
