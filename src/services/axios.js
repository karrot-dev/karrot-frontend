import Axios from 'axios'
import { Toast } from 'quasar'
import i18n from '@/i18n'

/*
* Axios configured for Django REST API
*/

import { camelizeKeys, underscorizeKeys } from '@/services/utils'

const axios = Axios.create({
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN',
})

axios.interceptors.request.use(request => {
  request.data = underscorizeKeys(request.data)
  return request
}, (error) => {
  Toast.create.warning(i18n.t('GLOBAL.CONNECTION_INTERRUPTED'))
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  response.data = camelizeKeys(response.data)
  return response
}, (error) => {
  if (error.response.status >= 500) {
    Toast.create.warning(i18n.t('GLOBAL.SERVER_ERROR'))
  }
  else {
    error.response.data = camelizeKeys(error.response.data)
  }
  return Promise.reject(error)
})

export default axios
