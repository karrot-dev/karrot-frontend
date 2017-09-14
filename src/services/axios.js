import Axios from 'axios'
import camelCase from 'camelcase'

const axios = Axios.create({
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN'
})

axios.interceptors.response.use(response => {
  response.data = camelizeKeys(response.data)
  return response
})

export default axios

export function camelizeKeys (val) {
  if (isObject(val)) {
    if (Array.isArray(val)) {
      return val.map(camelizeKeys)
    }
    else {
      let newVal = {}
      for (const key of Object.keys(val)) {
        newVal[camelCase(key)] = camelizeKeys(val[key])
      }
      return newVal
    }
  }
  else {
    return val
  }
}

export function isObject (x) {
  return typeof x === 'object' &&
    x !== null &&
    !(x instanceof RegExp) &&
    !(x instanceof Error) &&
    !(x instanceof Date)
}
