import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore (mods) {
  let modules = {}
  for (let key of Object.keys(mods)) {
    modules[key] = {...mods[key], namespaced: true}
  }
  return new Vuex.Store({
    modules, strict: false,
  })
}

export function throws (val) {
  return () => {
    if (typeof val === 'function') {
      val = val()
    }
    throw val
  }
}
