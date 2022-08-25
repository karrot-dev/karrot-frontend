let config
export async function getFirebaseConfig () {
  if (config) return config
  const data = await fetch('/api/config/').then(res => res.json())
  if (data.fcm) {
    config = camelizeKeys(data.fcm)
    return config
  }
  return null
}

// These are duplicated from utils/utils
// Something was causing the service worker to not load in dev mode when importing from there
// So I've copied them in here...
// TODO: make it possible to load utils/utils in local service worker dev mode...

function camelize (val) {
  return val.replace(/_(.)/g, (_, s) => s.toUpperCase())
}

function camelizeKeys (val) {
  if (isObject(val)) {
    if (Array.isArray(val)) {
      return val.map(camelizeKeys)
    }
    else {
      const newVal = {}
      for (const key of Object.keys(val)) {
        newVal[camelize(key)] = camelizeKeys(val[key])
      }
      return newVal
    }
  }
  else {
    return val
  }
}

function isObject (x) {
  return typeof x === 'object' &&
    x !== null &&
    !(x instanceof RegExp) &&
    !(x instanceof Error) &&
    !(x instanceof Date)
}
