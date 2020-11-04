import Vue from 'vue'
import LRU from 'lru-cache'
import { provide, inject, onMounted, onUnmounted, getCurrentInstance } from '@vue/composition-api'
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

const myvm = new Vue({
  methods: {
    foo () {
      console.log('running foo! current instance is', getCurrentInstance())
    },
  },
})

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
  const cache = new LRU({
    max: 3,
    ...options,
    // maxAge: 50000,
    // it does not pro-actively expire stuff...
    dispose (key, item) {
      if (item.onCacheExpired.length > 0) {
        for (const callback of item.onCacheExpired) {
          callback()
        }
      }
    },
  })

  onUnmounted(() => {
    console.log('resetting cache!')
    cache.reset()
  })

  return cache
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
  if (usingCache) {
    captured.callbacks.onCacheMounted.push(callback)
  }
  else {
    onMounted(callback)
  }
}

export function onCacheUnmounted (callback) {
  if (usingCache) {
    captured.callbacks.onCacheUnmounted.push(callback)
  }
  else {
    onUnmounted(callback)
  }
}

export function onCacheExpired (callback) {
  if (usingCache) {
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

    const vm = getCurrentInstance()
    console.log('vm is use cached is', vm)
    myvm.foo()
    // vm.$root.rootfoo()
    // const root = vm.$root

    // console.log('root is', vm.$root)
    // setCurrentInstance(root) // boo doesn't get exported :(
    try {
      const value = initializeCache()
      if (!captured.permitCachedUsage) {
        throw new Error('You did not call permitCachedUsage() inside a function that was cached. This is just to make you aware that it might need to support cached usage.')
      }
      item = {
        value,
        // these might have been set because the initializeValue can call them globally...
        ...captured.callbacks,
      }
      cache.set(cacheKey, item)
    }
    finally {
      isUsingCache = false
      captured = initialCaptured()
    }
  }
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
