import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore (mods, { debug = false } = {}) {
  let modules = {}
  for (let key of Object.keys(mods)) {
    modules[key] = {...mods[key], namespaced: true}
  }

  const store = new Vuex.Store({
    modules, strict: false,
  })

  if (debug) {
    store.subscribe(({type, payload}) => console.log('mutation', type, payload))
  }

  return store
}

export function throws (val) {
  return () => {
    if (typeof val === 'function') {
      val = val()
    }
    throw val
  }
}
