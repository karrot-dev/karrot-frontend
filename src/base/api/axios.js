import Axios from 'axios'
import i18n from '@/base/i18n'
import { Notify, throttle } from 'quasar'

import { camelizeKeys, underscorizeKeys } from '@/utils/utils'
import { isServerError } from '@/utils/datastore/helpers'
import { sleep } from '>/helpers'
import { random } from 'lodash'

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
if (process.env.DEV && !/^https/.test(process.env.KARROT.BACKEND)) {
  axios.interceptors.response.use(async response => {
    await sleep(random(200, 800))
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
