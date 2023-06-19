// eslint-disable-next-line import/no-named-as-default
import Axios from 'axios'
import qs from 'qs'
import { Notify, throttle } from 'quasar'

import { configureAxiosProgress } from '@/base/api/progress'
import i18n from '@/base/i18n'
import { isServerError } from '@/utils/datastore/helpers'
import { camelizeKeys, devSleep, underscorizeKeys } from '@/utils/utils'

/*
* Axios configured for Django REST API
*/

const axios = Axios.create({
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN',
  paramsSerializer: params => qs.stringify(params, {
    // this works nicely with MultipleChoiceFilter in the backend
    // so params { blah: ['a', 'b'] } will turn into blah=a&blah=b
    arrayFormat: 'repeat',
    // this puts it back to how default axios behaves
    skipNulls: true,
  }),
})

configureAxiosProgress(axios)

const makeThrottledWarner = (message) =>
  throttle(() =>
    Notify.create({
      icon: 'priority_high',
      color: 'warning',
      position: 'bottom-left',
      timeout: 5000,
      message: i18n.t(message),
    }),
  5000)

const showServerError = makeThrottledWarner('GLOBAL.SERVER_ERROR')

axios.interceptors.request.use(request => {
  if (request.data instanceof FormData) {
    return request
  }
  request.data = underscorizeKeys(request.data)
  return request
})

// add artificial delay for dev env
if (process.env.DEV) {
  axios.interceptors.response.use(async response => {
    await devSleep()
    return response
  })
}

axios.interceptors.response.use(response => {
  response.data = camelizeKeys(response.data)
  return response
}, async error => {
  if (error.response && error.response.data) {
    error.response.data = camelizeKeys(error.response.data)
  }
  if (isServerError(error)) {
    showServerError()
  }
  throw error
})

export default axios

export function parseCursor (c) {
  return c ? c.substr(c.indexOf('/api')) : null
}
