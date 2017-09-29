import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore (mods, getters = {}) {
  let modules = {}
  for (let key of Object.keys(mods)) {
    modules[key] = {...mods[key], namespaced: true}
  }

  for (let key of Object.keys(getters)) {
    let [moduleName, name] = key.split('/')
    if (!modules[moduleName]) modules[moduleName] = { namespaced: true }
    if (!modules[moduleName].getters) modules[moduleName].getters = {}
    modules[moduleName].getters[name] = getters[key]
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
