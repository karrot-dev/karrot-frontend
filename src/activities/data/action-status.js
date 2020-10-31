// action statuses
// eslint-disable-next-line no-unused-vars
import { shallowReactive, toRefs } from '@vue/composition-api'
import { isNetworkError, isServerError, isValidationError } from '@/utils/datastore/helpers'

const INITIAL = 'INITIAL'
const PENDING = 'PENDING'
const SUCCESS = 'SUCCESSS'
const ABORTED = 'ABORTED'
const VALIDATION_ERRORS = 'VALIDATION_ERRORS'
const SERVER_ERROR = 'SERVER_ERROR'
const NETWORK_ERROR = 'NETWORK_ERROR'
const UNHANDLED_ERROR = 'UNHANDLED_ERROR'

export function createActionStatus () {
  return {
    state: INITIAL,
    pending: false,
    validationErrors: {},
    hasValidationErrors: false,
    serverError: false,
    networkError: false,
    startedAt: null,
    finishedAt: null,
    aborted: false,
    unhandledError: null,
    result: null,
  }
}

export function withStatus (res, fn) {
  // const res = shallowReactive(initialActionStatus())

  Object.assign(res, {
    state: PENDING,
    pending: true,
    startedAt: new Date(),
  })

  Promise.resolve(fn.apply(arguments)).then(result => {
    Object.assign(res, {
      result,
      finishedAt: new Date(),
      pending: false,
      state: SUCCESS,
    })
  }).catch(error => {
    res.finishedAt = new Date()
    res.pending = false
    if (error.type === 'ActionAborted') {
      console.warn('action aborted!')
      res.aborted = true
      res.state = ABORTED
    }
    else if (isValidationError(error)) {
      res.state = VALIDATION_ERRORS
      res.validationErrors = error.response.data
      // if (error.response.status === 403) {
      //   commit('auth/setMaybeLoggedOut', true, { root: true })
      // }
      // return false
    }
    else if (isServerError(error)) {
      res.state = SERVER_ERROR
      res.serverError = true
    }
    else if (isNetworkError(error)) {
      res.state = NETWORK_ERROR
      res.networkError = true
    }
    else {
      // some other error, can't handle it here
      res.unhandledError = error
      res.state = UNHANDLED_ERROR
      throw error
    }
  })
}
