// This is a wrapper around sentry to only export what we use, that we can
// then use in dynamic imports whilst rollup doesn't seem to treeshake
// dynamic imports properly
export { init, captureMessage, captureException } from '@sentry/vue'
