import Axios from 'axios'
import i18n from '@/base/i18n'
import { Notify, throttle } from 'quasar'

import { camelizeKeys, underscorizeKeys } from '@/utils/utils'
import { isValidationError } from '@/utils/datastore/helpers'

/*
* Axios configured for Django REST API
*/

const axios = Axios.create({
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN',
})

const makeThrottledWarner = (message) =>
  throttle(() =>
    Notify.create({
      type: 'warning',
      position: 'bottom-left',
      timeout: 5000,
      message: i18n.t(message),
    }),
  5000)

const showConnectionInterruptedWarning = makeThrottledWarner('GLOBAL.CONNECTION_INTERRUPTED')
const showServerError = makeThrottledWarner('GLOBAL.SERVER_ERROR')

axios.interceptors.request.use(request => {
  if (request.data instanceof FormData) {
    return request
  }
  request.data = underscorizeKeys(request.data)
  return request
}, error => {
  showConnectionInterruptedWarning()
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  response.data = camelizeKeys(response.data)
  return response
}, async error => {
  if (error.response && error.response.data) {
    error.response.data = camelizeKeys(error.response.data)
  }
  if (!isValidationError(error)) {
    showServerError()
  }
  throw error
})

export default axios

export function parseCursor (c) {
  return c ? c.substr(c.indexOf('/api')) : null
}
