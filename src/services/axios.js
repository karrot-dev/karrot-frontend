import Axios from 'axios'
import i18n from '@/i18n'
import { Notify, debounce } from 'quasar'

import { camelizeKeys, underscorizeKeys } from '@/services/utils'
import { isValidationError } from '@/store/helpers'

/*
* Axios configured for Django REST API
*/

const axios = Axios.create({
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN',
})

const showDebouncedWarning = debounce((message) => {
  Notify.create({
    type: 'warning',
    position: 'bottom-left',
    timeout: 5000,
    message,
  })
}, 5000, true)

axios.interceptors.request.use(request => {
  if (request.data instanceof FormData) {
    return request
  }
  request.data = underscorizeKeys(request.data)
  return request
}, error => {
  showDebouncedWarning(i18n.t('GLOBAL.CONNECTION_INTERRUPTED'))
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
    showDebouncedWarning(i18n.t('GLOBAL.SERVER_ERROR'))
  }
  throw error
})

export default axios

export function parseCursor (c) {
  return c ? c.substr(c.indexOf('/api')) : null
}
