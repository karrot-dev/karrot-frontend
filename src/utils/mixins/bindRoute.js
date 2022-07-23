import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default function bindRoute (params) {
  // from https://jsfiddle.net/Herteby/1z4qsjds/
  const mixin = {
    computed: {},
  }
  for (const key in params) {
    const def = params[key]
    mixin.computed[key] = {
      get () {
        if (Object.prototype.hasOwnProperty.call(this.$route.query, key)) {
          return this.$route.query[key]
        }
        else {
          return def
        }
      },
      set (val) {
        if (val === def) {
          // if value is same as the default, remove it from the query to keep the URL neat
          const query = { ...this.$route.query }
          delete query[key]
          this.$router.replace({ query }).catch(() => {})
        }
        else {
          this.$router.replace({ query: { ...this.$route.query, ...{ [key]: val } } }).catch(() => {})
        }
      },
    }
  }
  return mixin
}

export function useRouteParam (name, defaultValue = null) {
  const router = useRouter()
  const route = useRoute()

  return computed({
    get () {
      if (Object.prototype.hasOwnProperty.call(route.query, name)) {
        return route.query[name]
      }
      else {
        return defaultValue
      }
    },
    set (val) {
      if (val === defaultValue) {
        if (!route.query[name]) return // not even in the query
        // if value is same as the default, remove it from the query to keep the URL neat
        const query = { ...route.query }
        delete query[name]
        router.replace({ query }).catch(() => {})
      }
      else {
        if (route.query[name] === val) return // hasn't changed
        router.replace({ query: { ...route.query, ...{ [name]: val } } }).catch(() => {})
      }
    },
  })
}
