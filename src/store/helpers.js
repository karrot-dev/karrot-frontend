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
 * Defines a vuex module that can be used to handle async request metadata.
 *
 * Instantiation:

 const meta = createMetaModule()
 export const modules = { meta }

 * Usage:

const actions = {
  ...withMeta({
    async save ({ commit, dispatch }, group) {
      commit(types.RECEIVE_GROUP, { group: await groups.save(group) })
    },
  })
}

 The meta is stored in two ways:
   - if the argument to the action is a number, or an object containing an id field,
     then we store the meta in a nested object at path id/actionName, e.g. { 23: { save: { pending: true } }
   - otherwise, we key it by the action name, e.g. { fetchList: { pending: true }

 You can access it via function getters `meta/byId` and `meta/byAction`

 */

export function createMetaModule () {
  return {
    namespaced: true,
    state: {
      byId: {},
      byAction: {},
    },
    getters: {
      byId: state => id => state.byId[id] || {},
      byAction: state => actionName => state.byAction[actionName] || {},

      // Check if any of the actions for this id are pending
      pendingById: (state, getters) => id => {
        return Object.values(getters.byId(id)).some(({ pending }) => pending)
      },
    },
    mutations: {
      update (state, { actionName, id, value }) {
        if (id) {
          if (!state.byId[id]) Vue.set(state.byId, id, {})
          Vue.set(state.byId[id], actionName, value)
        }
        else {
          state.byAction[actionName] = value
        }
      },
      clear (state, { actionName, id }) {
        if (id) {
          if (state.byId[id]) {
            Vue.delete(state.byId[id], actionName)
            if (Object.keys(state.byId[id]).length === 0) {
              Vue.delete(state.byId, id)
            }
          }
        }
        else {
          Vue.delete(state.byAction, actionName)
        }
      },
    },
  }
}

export function withMeta (actions, { namespace = 'meta' } = {}) {
  const wrappedActions = {}
  for (const [actionName, action] of Object.entries(actions)) {
    wrappedActions[actionName] = wrapAction(namespace, actionName, action)
  }
  return wrappedActions
}

function findId (data) {
  if (typeof data === 'number') {
    return data
  }
  else if (typeof data === 'object' && data.hasOwnProperty('id')) {
    return data.id
  }
}

function wrapAction (namespace, actionName, fn) {
  return async function (ctx, data) {
    const { commit } = ctx
    const id = findId(data)

    const runAction = () => fn.apply(this, arguments)
    const update = value => commit(`${namespace}/update`, { actionName, id, value })
    const clear = () => commit(`${namespace}/clear`, { actionName, id })

    update({ pending: true })

    try {
      const result = await runAction()
      clear()
      return result
    }
    catch (error) {
      if (isValidationError(error)) {
        update({ validationErrors: error.response.data })
      }
      else {
        // some other error, can't handle it here
        clear()
        throw error
      }
    }
  }
}
