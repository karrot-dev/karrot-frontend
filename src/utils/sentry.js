let SentryPromise

export function configureSentry (app, { dsn, environment }) {
  if (process.env.DEV) {
    if (process.env.ENABLE_DEV_SENTRY !== 'true') {
      return
    }
    environment = 'dev'
  }
  // Async, import so we only load sentry lib if actually using it
  SentryPromise = import('@sentry/vue')

  SentryPromise.then(Sentry => {
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
  })
}

export function captureException (...args) {
  if (!SentryPromise) return
  SentryPromise.then(Sentry => Sentry.captureException(...args))
}

export function captureMessage (...args) {
  if (!SentryPromise) return
  SentryPromise.then(Sentry => Sentry.captureMessage(...args))
}
