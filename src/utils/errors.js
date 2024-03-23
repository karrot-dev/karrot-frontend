let Sentry

export function configureSentry (app, { dsn, environment }) {
  if (import.meta.env.DEV) {
    if (process.env.ENABLE_DEV_SENTRY !== 'true') {
      return
    }
    environment = 'dev'
  }

  // Async, import so we only load sentry lib if actually using it
  // The imported one here only has the functions we want to ensure
  // treeshaking works
  import('./sentry').then(imported => {
    Sentry = imported
    Sentry.init({
      app,
      dsn,
      environment,
      release: process.env.KARROT_COMMIT,

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
  if (!Sentry) return
  Sentry.captureException(...args)
}

export function captureMessage (...args) {
  if (!Sentry) return
  Sentry.captureMessage(...args)
}
