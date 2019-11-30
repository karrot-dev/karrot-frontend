import Vue from 'vue'
import { Platform } from 'quasar'
import router from '@/base/router'

// Don't want to fight with vue about clearing marks, etc...
const ENABLED = !Vue.config.performance

let done = false
let firstLoad = true
const startMark = 'karrot-start'

function reset () {
  done = false
  clearPerformanceData()
  performance.mark(startMark)
}

function clearPerformanceData () {
  // Don't mess with clearing things if vue performance mode is on!
  if (!Vue.config.performance) {
    performance.clearMarks()
    performance.clearMeasures()
  }
}

if (ENABLED) {
  router.beforeEach((to, from, next) => {
    if (firstLoad) {
      firstLoad = false
    }
    else {
      reset()
    }
    measure('route', 'before')
    next()
  })

  router.afterEach(() => {
    measure('route', 'after')
  })
  Vue.directive('measure', {
    inserted (el, { value }) {
      if (done) return
      measure('MM', value) // MM = "Meaingful Mount" inspired by FMP (First Meaningful Paint)
      done = true
      finish()
    },
  })
}
else {
  // NOT enabled
  Vue.directive('measure', {})
}

function finish (name) {
  const entries = performance
    .getEntriesByType('measure')
    .filter(({ name }) => /^karrot /.test(name))
    .map(({ name, duration }) => ({
      name: name.replace(/^karrot /, ''),
      ms: duration,
    }))
  const payload = {
    route: router.currentRoute.name,
    mobile: Boolean(Platform.is.mobile),
    entries,
  }
  console.log('finished!', payload)
  clearPerformanceData()
}

export function measure (name, qualifier) {
  if (ENABLED && !done) {
    performance.measure(['karrot', name, qualifier].join(' '), startMark)
  }
}

export function measureMixin (name) {
  return {
    mounted () {
      measure(name, 'mounted')
    },
  }
}
