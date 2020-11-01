import { isNetworkError, isServerError, isValidationError } from '@/utils/datastore/helpers'

const INITIAL = 'INITIAL'
const PENDING = 'PENDING'
const SUCCESS = 'SUCCESSS'
const ABORTED = 'ABORTED'
const VALIDATION_ERRORS = 'VALIDATION_ERRORS'
const SERVER_ERROR = 'SERVER_ERROR'
const NETWORK_ERROR = 'NETWORK_ERROR'
const UNHANDLED_ERROR = 'UNHANDLED_ERROR'

export function createStatus () {
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
    promise: null,
  }
}

export function withStatus (res, fn) {
  Object.assign(res, {
    ...createStatus(), // reset it incase it's an old one...
    state: PENDING,
    pending: true,
    startedAt: new Date(),
  })

  res.promise = Promise.resolve(fn.apply(arguments)).then(result => {
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
