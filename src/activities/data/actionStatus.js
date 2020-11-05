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

function getNow () {
  return new Date().getTime()
}

export function withStatus (status, fn) {
  if (status.state === PENDING) throw new Error('action already in progress!')
  Object.assign(status, {
    ...createStatus(), // reset it incase it's an old one...
    state: PENDING,
    pending: true,
    startedAt: getNow(),
  })

  status.promise = Promise.resolve(fn.apply(arguments)).then(result => {
    Object.assign(status, {
      result,
      finishedAt: getNow(),
      pending: false,
      state: SUCCESS,
    })
  }).catch(error => {
    status.finishedAt = getNow()
    status.pending = false
    if (error.type === 'ActionAborted') {
      console.warn('action aborted!')
      status.aborted = true
      status.state = ABORTED
    }
    else if (isValidationError(error)) {
      status.state = VALIDATION_ERRORS
      status.validationErrors = error.response.data
      // if (error.response.status === 403) {
      //   commit('auth/setMaybeLoggedOut', true, { root: true })
      // }
      // return false
    }
    else if (isServerError(error)) {
      status.state = SERVER_ERROR
      status.serverError = true
    }
    else if (isNetworkError(error)) {
      status.state = NETWORK_ERROR
      status.networkError = true
    }
    else {
      // some other error, can't handle it here
      status.unhandledError = error
      status.state = UNHANDLED_ERROR
      throw error
    }
  })
  return status
}
