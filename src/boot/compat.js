// eslint-disable-next-line
import { configureCompat } from 'vue'

// for compatibility with vue-croppa
// can be deleted once vue-croppa supports vue 3 or we don't use it anymore
// see https://github.com/zhanziyang/vue-croppa/issues/235
// also check quasar.conf.js

configureCompat({
  MODE: 3,
})

export default ({ app }) => {
  // TODO: remove this in next minor release of vue, as it will be default in the future...
  app.config.unwrapInjectedRef = true
}
