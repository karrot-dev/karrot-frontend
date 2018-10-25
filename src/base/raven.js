import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (__ENV.RAVEN_CONFIG) {
  Raven
    .config(__ENV.RAVEN_CONFIG, {
      ignoreErrors: ['ResizeObserver loop limit exceeded'],
      release: __ENV.GIT_SHA1,
    })
    .addPlugin(RavenVue, Vue)
    .install()
}
