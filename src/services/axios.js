import Axios from 'axios'
import { Toast } from 'quasar'

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
  Toast.create.warning('Could not connect to the server') // TODO translate
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  response.data = camelizeKeys(response.data)
  return response
}, (error) => {
  if (error.response.status >= 500) {
    Toast.create.warning('Server error') // TODO translate
  }
  else {
    error.data = camelizeKeys(error.data)
  }
  return Promise.reject(error)
})

export default axios
