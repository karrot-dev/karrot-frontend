import Vue from 'vue'
import Vuex from 'vuex'
import raf from 'raf'

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

export function makeFindAllIterable (wrapper) {
  const findAll = wrapper.constructor.prototype.findAll
  wrapper.findAll = function () {
    const wrapperArray = findAll.apply(this, arguments)
    wrapperArray[Symbol.iterator] = () => {
      let nextIndex = 0
      return {
        next () {
          if (nextIndex < wrapperArray.length) {
            return { value: wrapperArray.at(nextIndex++), done: false }
          }
          else {
            return { done: true }
          }
        },
      }
    }
    return wrapperArray
  }
  return wrapper
}

export function polyfillRequestAnimationFrame () {
  raf.polyfill()
}
