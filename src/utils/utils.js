import deepEqual from 'deep-equal'
import { debounce } from 'quasar'

import locales from '@/locales'

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

// True if it's undefined or null, otherwise false
export function isNil (val) {
  return typeof val === 'undefined' || val === null
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
  return obj => removeKeys(obj, keys)
}

export function removeKeys (obj, keys) {
  const copy = { ...obj }
  for (const key of keys) {
    delete copy[key]
  }
  return copy
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

  // Multiple images
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

  // Check for other image fields
  for (const key of Object.keys(entry)) {
    const value = entry[key]
    if (value && typeof value === 'object' && value.toBlob) {
      const image = entry[key]
      const blob = await image.toBlob(MIME_TYPE)
      if (!blob) throw new Error('failed to make a blob for image')
      data.append(underscorize(key), blob, `image.${EXTENSION}`)
      delete entry[key]
    }
  }

  if (entry.attachments) {
    const blobs = {}
    for (const idx of Object.keys(entry.attachments)) {
      const attachment = entry.attachments[idx]
      if (attachment._file) {
        blobs[`attachments.${idx}.file`] = attachment._file
      }
      else if (attachment._new) {
        throw new Error('new attachment did not have a file')
      }
    }
    for (const key of Object.keys(blobs)) {
      const blob = blobs[key]
      data.append(key, blob, blob.name)
    }
    // we need to leave our original images intact, but only send the required properties to the server
    entry.attachments = entry.attachments.map(removeAttachmentMetaKeys)
  }

  data.append(
    'document',
    new Blob(
      [JSON.stringify(underscorizeKeys(entry))],
      { type: 'application/json' },
    ),
  )

  return data
}

export function getFormDataSize (formData) {
  return Array
    .from(formData.values(), data => data instanceof Blob ? data.size : data.length)
    .reduce((sum, size) => sum + size, 0)
}

function removeAttachmentMetaKeys (obj) {
  // Get rid of all the keys that start with _, except _removed
  // Also get rid of stuff we don't want to send to the server
  const keysToRemove = [
    ...Object.keys(obj).filter(key => key.startsWith('_') && key !== '_removed'),
    'urls',
  ]
  return removeKeys(obj, keysToRemove)
}

/**
 * Can use this to slow down requests to make it a bit more realistic
 *
 * Use the setDevSleep(<min>, <max>) function in the developer console to enable it
 *
 * e.g. to add a random delay between 300ms and 800ms you can run:
 *
 *   setDevSleep(300, 800)
 *
 * to clear it again:
 *
 *   setDevSleep()
 */
export async function devSleep () {
  if (process.env.DEV) {
    const value = localStorage.getItem('DEV_SLEEP')
    if (value) {
      const [min, max] = value.split(',').map(n => parseInt(n, 10))
      const random = require('lodash/random') // only load if we need it
      await sleep(random(min, max))
    }
  }
}

if (process.env.DEV) {
  window.setDevSleep = function (min, max) {
    if (min && max) {
      localStorage.setItem('DEV_SLEEP', [min, max].join(','))
      console.log(`set dev sleep to min ${min}ms and max ${max}ms`)
    }
    else {
      localStorage.removeItem('DEV_SLEEP')
      console.log('cleared dev sleep')
    }
  }
}

export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function detectLocale () {
  let requested = []
  if (navigator.languages) {
    navigator.languages.forEach(e => {
      requested.push(e.toLowerCase())
      // detect similar languages with slightly less priority
      if (e.includes('-')) {
        requested.push(e.replace(/-.*$/, '').toLowerCase())
      }
      // alias definitions
      else if (e === 'zh') {
        requested.push('zh-hans', 'zh-hant')
      }
      else if (e === 'zh_TW') {
        requested.push('zh-hant')
      }
      else if (e === 'zh_CN') {
        requested.push('zh-hans')
      }
    })
  }
  else {
    const val =
      navigator.language ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      navigator.userLanguage
    if (val) {
      requested = [val.toLowerCase()]
    }
  }
  if (requested) {
    return requested.find(e => locales[e])
  }
}

export function isViewableImageContentType (contentType) {
  // List from https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types
  // Which says: The following image types are used commonly enough to be considered safe for use on web pages:
  if (!contentType) return false
  return [
    'image/apng',
    'image/avif',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
  ].includes(contentType.toLowerCase())
}
