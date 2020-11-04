import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import VueCompositionAPI, {
  provide,
  inject,
  onMounted,
  onUnmounted,
  // eslint-disable-next-line no-unused-vars
  // wrapHookCall,
} from '@vue/composition-api'

/*
Hmmm the cache concept is totally fucked because the reactivity of the objects gets disabled when the component that it was
initialized under gets unmounted:

vm.$on('hook:destroyed', () => {
    console.log('aha hook:destroyed!')
  })

getCurrentInstance() is what it uses to attach itself too, and if we also had access to setCurrentInstance() we could handle it
(by attaching it to the vm.$root). but we don't.... so every computed()/ref() is in the context of the current component.

I thought it was just about the hot reload for a while, but it's not...

swrv doesn't have this problem because it caches data...

I _suppose_ I could go down this path too, which also means it's more suitable for caching in local storage, or refreshing from server...

HMMM but then I have my original problem, the cache won't receive any websocket updates...
so, a simple way is to still always refetch...

 */
// hmmmm... why do I need to do it here too? I guess the boot ones haven't been called?
// Vue.use(VueCompositionAPI)

// const vmCache = {
//   vm: null,
//   childVm: null,
// }

// eslint-disable-next-line no-unused-vars
// function runInContextWrap (fn) {
//   // abuse of a vm to get it to use composition-api activateCurrentInstance / setCurrentInstance
//   // so we don't have the thing destroyed later...
//   return wrapHookCall(getCurrentInstance().$root, fn)()
// }

// eslint-disable-next-line no-unused-vars
function runInContextVue (fn) {
  // I don't actually unerstand how this works really. as I destroy it, but it doesn't make my reactive things
  // that were created in it's context go away... the watchers stay active though...
  const vm = new Vue({
    name: 'CachedVMHack',
    render () {
      // TODO: should probably ensure it only runs once
      return fn()
    },
  })
  // total hack... it's just that this causes the render function to be immediately
  // executed with the currentInstance set inside the composition api lib, thus setting the context for us
  const result = vm.$options.render()
  // vm.$destroy() // does this matter?
  onCacheExpired(() => {
    // console.log('destroying vm because cache expire!')
    // this is nice as it triggers the onInvalidate callback in watchers...
    vm.$destroy()
  })
  return result
}

// eslint-disable-next-line no-unused-vars
function runInContextNone (fn) {
  return fn()
}

const runInContext = runInContextVue

const injectionKey = Symbol('cache')

export function provideCache (cache) {
  provide(injectionKey, cache)
}

export function useCache () {
  return {
    cache: inject(injectionKey),
  }
}

export function createCache (options) {
  const OLD_MS = 3000
  let cache = {}
  function get (key) {
    const entry = cache[key]
    if (entry) {
      entry.accessedAt = getNow()
      return entry.value
    }
    return null
  }

  function set (key, value) {
    cache[key] = { value, accessedAt: getNow() }
  }

  function getNow () {
    return new Date().getTime()
  }

  const interval = setInterval(() => {
    const now = getNow()
    for (const key of Object.keys(cache)) {
      const { value, accessedAt } = cache[key]
      if ((now - accessedAt) > OLD_MS) {
        if (value.active) {
          value.accessedAt += OLD_MS // extend lifetime a bit more
        }
        else {
          console.log('expiring item', value)
          if (value.onCacheExpired.length > 0) {
            for (const callback of value.onCacheExpired) {
              callback()
            }
          }
          delete cache[key]
        }
      }
    }
  }, OLD_MS)

  onUnmounted(() => {
    // reset!
    cache = {}
    clearInterval(interval)
  })

  return {
    get,
    set,
  }
}

function initialCaptured () {
  return {
    callbacks: {
      onCacheMounted: [],
      onCacheUnmounted: [],
      onCacheExpired: [],
    },
  }
}

let captured = initialCaptured()

export function permitCachedUsage () {
  captured.permitCachedUsage = true
}

let isUsingCache = false

export function usingCache () {
  return isUsingCache
}

export function onCacheMounted (callback) {
  if (usingCache()) {
    captured.callbacks.onCacheMounted.push(callback)
  }
  else {
    onMounted(callback)
  }
}

export function onCacheUnmounted (callback) {
  if (usingCache()) {
    captured.callbacks.onCacheUnmounted.push(callback)
  }
  else {
    onUnmounted(callback)
  }
}

export function onCacheExpired (callback) {
  if (usingCache()) {
    captured.callbacks.onCacheExpired.push(callback)
  }
  else {
    onUnmounted(callback)
  }
}

export function useCached (cacheKey, initializeCache) {
  const { cache } = useCache()
  let item = cache.get(cacheKey)
  if (!item) {
    isUsingCache = true
    try {
      const value = runInContext(() => initializeCache())

      if (!captured.permitCachedUsage) {
        throw new Error('You did not call permitCachedUsage() inside a function that was cached. This is just to make you aware that it might need to support cached usage.')
      }
      item = {
        value,
        active: true,
        ...captured.callbacks,
      }
      cache.set(cacheKey, item)
    }
    finally {
      isUsingCache = false
      captured = initialCaptured()
    }
  }

  onMounted(() => {
    item.active = true
  })

  onUnmounted(() => {
    item.active = false
  })

  if (item.onCacheMounted.length > 0) {
    onMounted(() => {
      for (const callback of item.onCacheMounted) {
        callback()
      }
    })
  }
  if (item.onCacheUnmounted.length > 0) {
    onUnmounted(() => {
      for (const callback of item.onCacheUnmounted) {
        callback()
      }
    })
  }
  return item.value
}
