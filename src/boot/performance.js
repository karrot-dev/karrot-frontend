import { Platform } from 'quasar'
import axios from '@/base/api/axios'
import { debounceAndFlushOnUnload, underscorizeKeys } from '@/utils/utils'

const SAVE_INTERVAL_MS = 5000 // batch saves to the backend
const SHOW_PERFORMANCE_INFO = localStorage.getItem('SHOW_PERFORMANCE_INFO') !== null

export default async ({ store: datastore, app, router }) => {
  const performance = window.performance
  const fetch = window.fetch

  // Make sure we have all the required performance methods
  // and fetch to avoid needing the polyfill (we don't need all browser support)
  // and that vue's performance mode is not enabled (don't want to fight it)
  // unless we are actively wanting to show the performance info
  const ENABLED = fetch &&
    performance &&
    performance.clearMeasures &&
    performance.clearMarks &&
    performance.measure &&
    performance.mark &&
    (!app.config.performance || SHOW_PERFORMANCE_INFO)

  // For each load we measure up to the point where the first v-measure is measured
  // the set done to true so we don't record beyond that, until the next page load
  let done = false

  // The first load is the main page load from the server, after that we record the page
  // loads within the browser
  let firstLoad = true

  // When using performance.measure() we don't use a start mark initially, which causes it to
  // measure from the start of that whole page load, subsequent javascript page loads are only
  // measured from when we create the mark in router beforeEach()
  let startMark

  // What we will eventually save for this measurement run
  // Keeping it up here so its possible to add things to it as we go along...
  // ... well basically the firstLoad flag
  let currentStat = {}

  // Stats waiting to be saved
  const pendingStats = []

  function initialize () {
    startMark = 'karrot-start'
    done = false
    currentStat = {}
    performance.clearMarks()
    performance.clearMeasures()
    performance.clearResourceTimings()
    performance.mark(startMark)
  }

  function measure (name, qualifier) {
    if (!ENABLED || done) return
    const label = ['karrot', name, qualifier].join(' ').trim()
    if (startMark) {
      performance.measure(label, startMark)
    }
    else {
      performance.measure(label)
    }
  }

  function save () {
    const stats = [...pendingStats]
    pendingStats.length = 0
    const data = { stats }
    // Using fetch() API instead of axios, just for this keepalive thing ...
    fetch('/api/stats/', {
      method: 'POST',
      // keepalive is to help the request still work when called in the "unload" event
      // See https://fetch.spec.whatwg.org/#request-keepalive-flag
      keepalive: true,
      // without this mode set, chrome will attempt a preflight (cors) request, but fails with:
      // "Preflight request for request with keepalive specified is currently not supported"
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        [axios.defaults.xsrfHeaderName]: readCookie(axios.defaults.xsrfCookieName),
      },
      body: JSON.stringify(underscorizeKeys(data)),
    }).catch(() => {}) // ignore errors, we can't do anything about it
  }

  const debouncedSave = debounceAndFlushOnUnload(save, SAVE_INTERVAL_MS, { maxWait: SAVE_INTERVAL_MS * 2 })

  function finish () {
    const firstMeaningfulMount = performance.getEntriesByName('karrot MM')[0]
    if (!firstMeaningfulMount) return
    const stat = {
      ...currentStat,
      ms: Math.round(firstMeaningfulMount.duration),
      msResources: Math.round(performance
        .getEntriesByType('resource')
        .reduce((total, entry) => total + entry.duration, 0)),
      loggedIn: datastore.getters['auth/isLoggedIn'],
      group: datastore.getters['currentGroup/id'],
      routeName: router.currentRoute.name,
      routePath: router.currentRoute.fullPath,
      mobile: Boolean(Platform.is.mobile),
      browser: Platform.is.name,
      os: Platform.is.platform,
      dev: Boolean(process.env.DEV),
      app: Boolean(process.env.MODE === 'cordova'),
    }
    pendingStats.push(stat)
    debouncedSave()
    return stat
  }

  if (ENABLED) {
    router.beforeEach((to, from, next) => {
      onBeforeRoute.forEach(fn => fn())
      clearPerformanceInfo()
      if (firstLoad) {
        firstLoad = false
        currentStat.firstLoad = true
      }
      else {
        initialize()
        currentStat.firstLoad = false
      }
      next()
    })

    app.directive('measure', {
      mounted (el) {
        if (done) return
        measure('MM') // MM = "Meaningful Mount" inspired by FMP (First Meaningful Paint)
        done = true
        const stat = finish()
        if (SHOW_PERFORMANCE_INFO) updatePerformanceInfo(stat)
        el.dispatchEvent(new CustomEvent('measured', { bubbles: true, detail: stat }))
      },
    })
  }
  else {
    // measurement is not enabled
    // we create an empty directive so we don't have invalid use of v-measure directives in the rest of the code
    app.directive('measure', {})
  }

  function readCookie (name) {
    // Stolen from axios implementation
    // See https://github.com/axios/axios/blob/a17c70cb5ae4acd7aa307b7f7dc869953dea22c4/lib/helpers/cookies.js#L35-L36
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return (match ? decodeURIComponent(match[3]) : null)
  }

  let performanceInfoElement
  /**
   * Shows performance info in a little element in the top left of the screen
   * @param stat
   */
  function updatePerformanceInfo (stat) {
    if (!performanceInfoElement) {
      performanceInfoElement = document.createElement('div')
      document.body.appendChild(performanceInfoElement)
      Object.assign(performanceInfoElement.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '100000',
        background: 'rgba(255, 255, 255, 0.5)',
        color: 'black',
        fontSize: '10px',
        fontFamily: 'monospace',
        padding: '2px 4px',
        opacity: '0.5',
        display: 'none',
      })
    }
    performanceInfoElement.innerHTML = `${stat.ms} ms`
    performanceInfoElement.style.display = 'block'
  }

  function clearPerformanceInfo () {
    if (performanceInfoElement) {
      performanceInfoElement.style.display = 'none'
    }
  }
}

let totalMs = 0
let prevTotalMs = 0

const onBeforeRoute = []

onBeforeRoute.push(() => {
  totalMs = 0
  prevTotalMs = 0
})

setInterval(() => {
  if (prevTotalMs !== totalMs) {
    console.log('total time spent:', totalMs, 'ms')
    prevTotalMs = totalMs
  }
}, 1000)

export function createInstrument (name) {
  if (!SHOW_PERFORMANCE_INFO) return fn => fn
  let ms = 0
  let prevMs = 0

  onBeforeRoute.push(() => {
    ms = 0
    prevMs = 0
  })

  setInterval(() => {
    if (prevMs !== ms) {
      console.log('time spent:', name, '->', ms, 'ms')
      prevMs = ms
    }
  }, 1000)

  return fn => {
    return function () {
      const start = performance.now()
      const res = fn.apply(this, arguments)
      const inc = performance.now() - start
      ms += inc
      totalMs += inc
      return res
    }
  }
}
