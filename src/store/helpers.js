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

const defaultStatus = { pending: false, validationErrors: {} }

export function createMetaModule () {
  return {
    namespaced: true,
    state: {
      byId: {},
      byAction: {},
    },
    getters: {
      status: state => (actionName, id) => {
        const actual = id ? (state.byId[id] && state.byId[id][actionName]) : state.byAction[actionName]
        const composed = { ...defaultStatus, ...actual }
        composed.hasValidationErrors = Object.keys(composed.validationErrors).length > 0
        return composed
      },
    },
    actions: {
      clear ({ commit }, [actionName, id]) {
        commit('clear', { actionName, id })
      },
    },
    mutations: {
      update (state, { actionName, id, value }) {
        if (id) {
          if (!state.byId[id]) Vue.set(state.byId, id, {})
          Vue.set(state.byId[id], actionName, value)
        }
        else {
          Vue.set(state.byAction, actionName, value)
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

export function withMeta (actions, { namespace = 'meta', idPrefix = '', findId = defaultFindId } = {}) {
  const wrappedActions = {}
  for (const [actionName, action] of Object.entries(actions)) {
    wrappedActions[actionName] = wrapAction({ namespace, actionName, action, findId })
  }
  return wrappedActions
}

export function withPrefixedIdMeta (idPrefix, actions, options) {
  return withMeta(actions, { ...options, idPrefix })
}

function defaultFindId (data) {
  if (typeof data === 'number') {
    return data
  }
  else if (typeof data === 'object' && data.hasOwnProperty('id')) {
    return data.id
  }
}

function wrapAction ({ namespace, actionName, action, idPrefix, findId }) {
  return async function (ctx, data) {
    const { commit, getters } = ctx
    let id = findId(data)

    if (id && idPrefix) id = idPrefix + id

    if (getters[`${namespace}/status`](actionName, id).pending) {
      throw new Error(`action already pending for ${actionName}/${id}`)
    }

    const runAction = () => action.apply(this, arguments)
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
        return false
      }
      else {
        // some other error, can't handle it here
        clear()
        throw error
      }
    }
  }
}

export function metaStatusesWithId (getters, actions, id) {
  const result = {}
  for (let action of actions) {
    result[action + 'Status'] = getters['meta/status'](action, id)
  }
  return result
}

export function metaStatuses (actions) {
  const result = {}
  for (let action of actions) {
    result[action + 'Status'] = (state, getters) => getters['meta/status'](action)
  }
  return result
}

export function createRouteError (data) {
  return Object.assign(new Error(), {
    type: 'RouteError',
    data,
  })
}
