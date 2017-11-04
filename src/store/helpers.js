/**
 * Store independent helpers
 * If a helper depends on the vuex store, put it in storeHelpers.js
 */

import Vue from 'vue'

/**
 * Returns an object that maps entries of iterables by their `id` field
 *
 * @param iterable array to be indexed
 * @returns {object}
 */
export function indexById (iterable) {
  return iterable.reduce((acc, cur, i) => {
    acc[cur.id] = cur
    return acc
  }, {})
}

export function onlyHandleAPIError (error, handleFn) {
  const { response: { status = -1, data } = {} } = error
  if (status >= 400 && status < 500) {
    handleFn({ error: data })
  }
  else {
    handleFn({ error })
    throw error
  }
}

export function isValidationError (error) {
  const { response: { status = -1 } = {} } = error
  if (status >= 400 && status < 500) {
    return true
  }
  return false
}

export function isRequestError (error) {
  const { response: { status = -1 } = {} } = error
  if (status >= 500) {
    return true
  }
  if (error.request) {
    return true
  }
  return false
}

/**
 * Defines a vues module that can be used to handle async request metadata.
 *
 * Instantiation:

 const meta = defineRequestModule()
 export const modules = { meta }

 * Usage:

async save ({ commit, dispatch }, group) {
  dispatch('meta/request', {
    id: `save-${group.id}`,
    async run () {
      const updatedGroup = await groups.save(group)
      commit(types.RECEIVE_GROUP, { group: updatedGroup }) // other commits when successful
    },
  })
},
 */
export function defineRequestModule () {
  const types = {
    REQUEST: 'Request',
    RECEIVE_SUCCESS: 'Receive Success',
    RECEIVE_ERROR: 'Receive Error',
    CLEAR: 'Clear',
    CLEAR_ALL: 'Clear all',
  }

  function initialState () {
    return {
      entries: {},
    }
  }

  const state = initialState()

  const getters = {
    get: state => id => state.entries[id] || ({
      isWaiting: false,
      error: undefined,
      success: false,
    }),
    error: (state, getters) => id => field => {
      const { error: { [field]: [ message ] = [] } = {} } = getters.get(id)
      return message
    },
    isWaiting: (state, getters) => id => getters.get(id).isWaiting,
    success: (state, getters) => id => getters.get(id).success,
  }

  const actions = {
    async request ({ commit }, { id, run }) {
      commit(types.REQUEST, { id })
      try {
        await run()
        commit(types.RECEIVE_SUCCESS, { id })
      }
      catch (error) {
        if (isValidationError(error)) {
          commit(types.RECEIVE_ERROR, { id, error: error.response.data })
        }
        else if (isRequestError(error)) {
          // TODO: should we commit this at all?
          commit(types.RECEIVE_ERROR, { id, error: error.request })
        }
        else {
          // some other error, can't handle it here
          throw error
        }
      }
    },
    clear ({ commit }) {
      commit('clear')
    },
  }

  const mutations = {
    [types.REQUEST] (state, { id }) {
      Vue.set(state.entries, id, {
        isWaiting: true,
        error: undefined,
        success: false,
      })
    },
    [types.RECEIVE_SUCCESS] (state, { id }) {
      Vue.set(state.entries, id, {
        isWaiting: false,
        error: undefined,
        success: true,
      })
    },
    [types.RECEIVE_ERROR] (state, { id, error }) {
      Vue.set(state.entries, id, {
        isWaiting: false,
        error,
        success: false,
      })
    },
    [types.CLEAR] (state, { id }) {
      Vue.delete(state.entries, id)
    },
    [types.CLEAR_ALL] (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
  }

  return {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }
}
