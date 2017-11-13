import Axios from 'axios'
import { Toast } from 'quasar'
import i18n from '@/i18n'

/*
* Axios configured for Django REST API
*/

import { camelizeKeys, underscorizeKeys } from '@/services/utils'
import { isValidationError } from '@/store/helpers'

const axios = Axios.create({
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN',
})

axios.interceptors.request.use(request => {
  request.data = underscorizeKeys(request.data)
  return request
}, error => {
  Toast.create.warning(i18n.t('GLOBAL.CONNECTION_INTERRUPTED'))
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
    Toast.create.warning(i18n.t('GLOBAL.SERVER_ERROR'))
  }
  throw error
})

export default axios
