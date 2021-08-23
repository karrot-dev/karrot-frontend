import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

export default ({ app }) => {
  if (process.env.KARROT.SENTRY_CONFIG) {
    Sentry.init({
      dsn: process.env.KARROT.SENTRY_CONFIG,
      integrations: [
        new Integrations.Vue({ app, logErrors: true }),
        new Integrations.ExtraErrorData(),
      ],
      release: process.env.KARROT.GIT_SHA1,
      ignoreErrors: [
        'ResizeObserver loop limit exceeded', // Chrome
        'ResizeObserver loop completed with undelivered notifications', // Firefox
      ],
    })
  }
}
