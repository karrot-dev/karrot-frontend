import { reactive, toRefs, watch } from 'vue'
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
        if (Object.hasOwn(this.$route.query, key)) {
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

/**
 * Create refs that map to query params.
 *
 * You must pass in defaults for all the parameters you are interested in.
 * e.g.
 *     const { type, category } = useQueryParams({ type: 'animal', category: null })
 *
 *  You can destructure the result, each param is a read/write ref that will keep
 *  up to date with the underlying query param.
 */
export function useQueryParams (defaultParams) {
  const router = useRouter()
  const route = useRoute()

  // The defaults passed in form our base reactive state
  const state = reactive({ ...defaultParams })

  // Keep track of when we are updating so we can avoid circular updates
  let updatingQuery = false
  let updatingState = false

  // Read the initial query params so our state is up to date
  updateState()

  // Watch for updates to state and query
  watch(state, () => {
    if (!updatingState) updateQuery()
  })
  watch(() => route.query, () => {
    if (!updatingQuery) updateState()
  })

  // Set the state from the query
  // If the query is missing a param, uses the default
  function updateState () {
    updatingState = true
    for (const name of Object.keys(defaultParams)) {
      state[name] = route.query[name] || defaultParams[name]
    }
    updatingState = false
  }

  // Set the query from the state
  // No query param is set for falsey or default values
  function updateQuery () {
    updatingQuery = true
    const query = {}
    for (const name of Object.keys(state)) {
      const value = state[name]
      if (value && value !== defaultParams[name]) {
        query[name] = value
      }
    }
    router.replace({ query }).catch(() => {}).then(() => {
      updatingQuery = false
    })
  }

  return toRefs(state)
}
