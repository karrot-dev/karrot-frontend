import deepEqual from 'deep-equal'
import debounce from 'lodash/debounce'

// Quasar's ready() is broken until https://github.com/quasarframework/quasar/pull/2199
export function ready (fn) {
  if (typeof fn !== 'function') {
    return
  }

  if (document.readyState !== 'loading') {
    return fn()
  }

  document.addEventListener('DOMContentLoaded', fn, false)
}

export function camelizeKeys (val) {
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

export function underscorizeKeys (val) {
  if (isObject(val)) {
    if (Array.isArray(val)) {
      return val.map(underscorizeKeys)
    }
    else {
      const newVal = {}
      for (const key of Object.keys(val)) {
        newVal[underscorize(key)] = underscorizeKeys(val[key])
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

// Just enough to support the keys we get back from the Django API
export function camelize (val) {
  return val.replace(/_(.)/g, (_, s) => s.toUpperCase())
}

export function underscorize (val) {
  return val.replace(/[A-Z]/g, s => `_${s.toLowerCase()}`)
}

export function objectDiff (a, b) {
  const diff = {}
  for (const key of Object.keys({ ...a, ...b })) {
    if (!deepEqual(a[key], b[key])) {
      diff[key] = b[key]
    }
  }
  return diff
}

export function filterTruthy (obj) {
  return Object.entries(obj).filter(([_, v]) => v).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
}

export function withoutKeys (...keys) {
  return obj => {
    const copy = { ...obj }
    for (const key of keys) {
      delete copy[key]
    }
    return copy
  }
}

export function debounceAndFlushOnUnload (fn, ms, options = {}) {
  const debounced = debounce(fn, ms, options)
  window.addEventListener('unload', debounced.flush)
  return debounced
}

const MIME_TYPE = 'image/jpeg'
const EXTENSION = '.jpg'

export async function toFormData (sourceEntry) {
  const data = new FormData()
  const entry = { ...sourceEntry } // (shallow) clone

  if (entry.images) {
    const blobs = {}
    for (const idx of Object.keys(entry.images)) {
      const image = entry.images[idx]
      if (image.toBlob) {
        const blob = await image.toBlob(MIME_TYPE)
        if (!blob) throw new Error('failed to make a blob for image')
        blobs[`images.${idx}.image`] = blob
      }
      else if (image._new) {
        throw new Error('new image did not have a toBlob method')
      }
    }
    for (const key of Object.keys(blobs)) {
      data.append(key, blobs[key], `${key}${EXTENSION}`)
    }
    // we need to leave our original images intact, but only send the required properties to the server
    entry.images = entry.images.map(withoutKeys('toBlob', 'imageUrls'))
  }

  data.append(
    'document',
    new Blob(
      [JSON.stringify(entry)],
      { type: 'application/json' },
    ),
  )

  return data
}
