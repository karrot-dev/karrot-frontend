import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (process.env.RAVEN_CONFIG) {
  Raven
    .config(process.env.RAVEN_CONFIG, {
      ignoreErrors: ['ResizeObserver loop limit exceeded'],
    })
    .addPlugin(RavenVue, Vue)
    .install()
}
