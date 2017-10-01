import Axios from 'axios'
import { Toast } from 'quasar'
import store from '@/store'

/*
* Axios configured for Django REST API
*/

import { camelizeKeys, underscorizeKeys } from '@/services/utils'

const axios = Axios.create({
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN',
})

axios.interceptors.request.use(request => {
  store.dispatch('loadingprogress/start')
  request.data = underscorizeKeys(request.data)
  return request
}, (error) => {
  store.dispatch('loadingprogress/stop')
  Toast.create.warning('Could not connect to the server')
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  store.dispatch('loadingprogress/stop')
  response.data = camelizeKeys(response.data)
  return response
}, (error) => {
  store.dispatch('loadingprogress/stop')
  if (error.response.status >= 500) {
    Toast.create.warning('Server error')
  }
  else {
    error.data = camelizeKeys(error.data)
  }
  return Promise.reject(error)
})

export default axios
