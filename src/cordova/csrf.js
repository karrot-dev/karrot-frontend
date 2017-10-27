/*

  This is for handling csrf tokens

      Cordova apps run in a way that we don't get direct access to cookies.
      The sessions cookies are handled fine for us already, we don't need to
      worry about that bit.

      However, the csrf token mechanism relies on accessing the cookie value
      from javascript, and passing the value in the API request headers. This is
      not possible under cordova.

      Fortunately there is a nice little cordova plugin that lets us access the
      cookies!

      We add an http interceptor to pull out any csrf tokens cookie values and
      store the token locally, we then set this value on any outgoing requests
      headers.

*/

import axios from '@/services/axios'

const XSRF_HEADER_NAME = 'X-CSRFToken'
const XSRF_COOKIE_NAME = 'csrftoken'
const XSRF_STORAGE_KEY = 'csrftoken'

let csrftoken = window.localStorage.getItem(XSRF_STORAGE_KEY)

export function saveCsrfToken (val) {
  csrftoken = val
  localStorage.setItem(XSRF_STORAGE_KEY, csrftoken)
}

export function requiresCsrf (method) {
  return !/^(GET|HEAD|OPTIONS|TRACE)$/i.test(method)
}

function updateCsrfToken () {
  return fetchToken().then(val => {
    if (val && val !== csrftoken) {
      saveCsrfToken(val)
    }
  })
}

function fetchToken () {
  return new Promise((resolve) => {
    window.cookieEmperor.getCookie(CORDOVA_BACKEND, XSRF_COOKIE_NAME, data => {
      resolve(data.cookieValue)
    }, err => {
      if (err) console.warn(err)
      resolve(null)
    })
  })
}

axios.interceptors.request.use(request => {
  if (requiresCsrf(request.method) && csrftoken) {
    request.headers[XSRF_HEADER_NAME] = csrftoken
  }
  return request
})

axios.interceptors.response.use((response) => {
  return updateCsrfToken().then(() => response)
}, err => {
  return updateCsrfToken().then(() => Promise.reject(err))
})
