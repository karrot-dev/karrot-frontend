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

export function defineRequestModule ({ namespace = 'meta' } = {}) {
  const types = {
    REQUEST: 'Request',
    RECEIVE_SUCCESS: 'Receive Success',
    RECEIVE_ERROR: 'Receive Error',
    CLEAR: 'Clear',
  }

  const state = {
    entries: {},
  }

  const getters = {
    get: state => id => state.entries[id] || ({
      isWaiting: false,
      error: null,
      success: false,
    }),
    error: (state, getters) => id => field => {
      const error = getters.get(id).error
      return error && error[field] && error[field][0]
    },
  }

  const actions = {
    clear: ({ commit }) => commit('clear'),
  }

  const mutations = {
    [types.REQUEST] (state, { id }) {
      Vue.set(state.entries, id, {
        isWaiting: true,
        error: null,
        success: false,
      })
    },
    [types.RECEIVE_SUCCESS] (state, { id }) {
      Vue.set(state.entries, id, {
        isWaiting: false,
        error: null,
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
      Vue.set(state.entries, id, {
        isWaiting: false,
        error: null,
        success: false,
      })
    },
  }

  function namespaced (val) {
    return namespace + '/' + val
  }

  function createRequestAction ({ metaId, request }) {
    // we need to use the namespaced commits here, as the commit happens in parent
    // I didn't find a good workaround, maybe it would be better to dispatch an action from parent to child?
    return async function (store, arg) {
      const { commit } = store
      const id = metaId(arg)
      commit(namespaced(types.REQUEST), { id })
      try {
        await request(store, arg)
        commit(namespaced(types.RECEIVE_SUCCESS), { id })
      }
      catch (error) {
        console.log('receive error with id', id, error)
        const { response: { status = -1, data } = {} } = error
        if (status >= 400 && status < 500) {
          commit(namespaced(types.RECEIVE_ERROR), { id, error: data })
        }
        else {
          throw error
        }
      }
    }
  }

  return {
    [namespace]: {
      namespaced: true,
      state,
      getters,
      actions,
      mutations,
      createRequestAction,
    },
  }
}
