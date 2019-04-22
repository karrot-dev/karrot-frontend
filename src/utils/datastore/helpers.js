/**
 * Datastore related helpers
 * This file should not import the datastore itself, to avoid cyclic dependencies.
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

export function isValidationError (error) {
  const { response: { status = -1 } = {} } = error
  if (status >= 400 && status < 500) {
    return true
  }
  return false
}

export function isServerError (error) {
  const { response: { status = -1 } = {} } = error
  if (status >= 500) {
    return true
  }
  return false
}

export function isNetworkError (error) {
  if (error && error.message === 'Network Error') {
    return true
  }
  return false
}

const defaultStatus = {
  pending: false,
  validationErrors: {},
  serverError: false,
  networkError: false,
  startedAt: null,
}

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

        // errorCode is not intended to be shown to the user
        delete composed.validationErrors.errorCode

        // enrich with a shortcut to first error message, if any
        function firstError (errList) {
          for (const value of errList) {
            if (typeof value === 'string') {
              return value
            }
            return value[0]
          }
        }
        const firstValidationError = firstError(Object.values(composed.validationErrors))
        const firstNonFieldError = firstError([
          composed.validationErrors.nonFieldErrors,
          composed.validationErrors.detail,
        ].filter(e => !!e))

        return {
          ...composed,
          firstValidationError,
          hasValidationErrors: !!firstValidationError,
          firstNonFieldError,
        }
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

export function withMeta (actions, { namespace = 'meta', idPrefix = '', findId = defaultFindId, setCurrentId, getCurrentId } = {}) {
  const wrappedActions = {}
  for (const [actionName, action] of Object.entries(actions)) {
    wrappedActions[actionName] = wrapAction({ namespace, actionName, action, idPrefix, findId, setCurrentId, getCurrentId })
  }
  return wrappedActions
}

export function withPrefixedIdMeta (idPrefix, actions, options) {
  return withMeta(actions, { ...options, idPrefix })
}

export function defaultFindId (data) {
  if (!data) return undefined
  if (typeof data === 'number') {
    return data
  }
  if (typeof data === 'string') {
    let number = null
    try {
      number = parseInt(data, 10)
    }
    catch {}
    if (number !== null && !Number.isNaN(number)) {
      console.warn('findId: number passed as string', data)
    }
    return data
  }
  else if (typeof data === 'object' && data.hasOwnProperty('id')) {
    return data.id
  }
}

function wrapAction ({ namespace, actionName, action, idPrefix, findId, setCurrentId, getCurrentId }) {
  return async function (ctx, data) {
    const { commit, dispatch, getters } = ctx
    let id = findId(data)

    if (id && idPrefix) id = idPrefix + id

    const status = getters[`${namespace}/status`](actionName, id)
    if (status.pending && (new Date() - status.startedAt) < 1000) {
      console.warn(`debounce: action recently started and still pending (${actionName} ${id})`)
      return
    }

    const isActionAborted = () => {
      if (!getCurrentId) return false
      return getCurrentId(ctx) !== id
    }

    // wrap commit and dispatch to throw an error if the action should be aborted
    arguments[0] = {
      ...ctx,
      commit () {
        if (isActionAborted()) {
          throw createActionAbortedError()
        }
        commit.apply(this, arguments)
      },
      async dispatch () {
        if (isActionAborted()) {
          throw createActionAbortedError()
        }
        return dispatch.apply(this, arguments)
      },
    }

    const runAction = () => action.apply(this, arguments)
    const update = value => commit(`${namespace}/update`, { actionName, id, value })
    const clear = () => commit(`${namespace}/clear`, { actionName, id })

    update({ pending: true, startedAt: new Date() })
    if (setCurrentId) setCurrentId(ctx, data)

    try {
      const result = await runAction()
      clear()
      return result
    }
    catch (error) {
      if (error.type === 'ActionAborted') {
        console.warn('action aborted!', actionName, id)
        clear()
      }
      else if (isValidationError(error)) {
        update({ validationErrors: error.response.data })
        if (error.response.status === 403) {
          commit('auth/setMaybeLoggedOut', true, { root: true })
        }
        return false
      }
      else if (isServerError(error)) {
        update({ serverError: true })
      }
      else if (isNetworkError(error)) {
        update({ networkError: true })
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

export function createRouteRedirect (data) {
  return Object.assign(new Error(), {
    type: 'RouteRedirect',
    data,
  })
}

export function createActionAbortedError () {
  return Object.assign(new Error(), {
    type: 'ActionAborted',
  })
}

export function createPaginationModule () {
  return {
    namespaced: true,
    state: {
      prevCursor: null,
      nextCursor: null,
    },
    getters: {
      canFetchNext: state => typeof state.nextCursor === 'string',
    },
    actions: {
      async fetchNext ({ state, getters, dispatch }, fetchFn) {
        if (!getters.canFetchNext) return []
        const rawData = fetchFn(state.nextCursor)
        const data = await dispatch('extractCursor', rawData)
        return data
      },
      async extractCursor ({ commit }, data) {
        // TODO only set cursor for the current directions
        // fetchNext should not overwrite prevCursor
        data = await data
        commit('setCursor', { prevCursor: data.prev, nextCursor: data.next })
        return data.results
      },
    },
    mutations: {
      setCursor (state, { prevCursor, nextCursor }) {
        state.prevCursor = prevCursor
        state.nextCursor = nextCursor
      },
    },
  }
}

/**
 * Returns a module that can toggle values
 *
 * ```
 *  modules: {
 *   toggle: toggles({
 *     myToggleName: true, // defaults to `true`
 *   }),
 *  },
 * ```
 *
 * toggle:
 * dispatch('myModule/toggle/myToggleName')
 *
 * set to `true`, no matter the previous state:
 * dispatch('myModule/toggle/myToggleName', true)
 */

export function toggles (config) {
  let result = {
    namespaced: true,
    state: {},
    getters: {},
    actions: {},
    mutations: {
      set (state, { key, value }) {
        Vue.set(state, key, value)
      },
    },
  }
  for (let key in config) {
    result.state[key] = config[key]
    result.getters[key] = state => state[key]
    result.actions[key] = ({ state, commit, getters }, forceValue) => {
      if (forceValue !== undefined) {
        if (getters[key] !== forceValue) {
          commit('set', { key, value: forceValue })
        }
      }
      else {
        commit('set', { key, value: !state[key] })
      }
    }
  }
  return result
}
