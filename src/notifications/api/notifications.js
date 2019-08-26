import axios, { parseCursor } from '@/base/api/axios'

export default {
  async get (id) {
    return (await axios.get(`/api/notifications/${id}/`)).data
  },

  async list () {
    const response = (await axios.get('/api/notifications/')).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convertListResults(response.results),
    }
  },

  async listMore (cursor) {
    const response = (await axios.get(cursor)).data
    return {
      ...response,
      next: parseCursor(response.next),
      prev: parseCursor(response.prev),
      results: convertListResults(response.results),
    }
  },

  async markClicked (id) {
    return (await axios.post(`/api/notifications/${id}/mark_clicked/`)).data
  },

  async markSeen () {
    return (await axios.post('/api/notifications/mark_seen/')).data
  },
}

function convertListResults (results) {
  return {
    notifications: convert(results.notifications),
    meta: convertMeta(results.meta),
  }
}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    return {
      ...val,
      createdAt: new Date(val.createdAt),
      expiresAt: val.expiresAt && new Date(val.expiresAt),
    }
  }
}

export function convertMeta (val) {
  return {
    ...val,
    markedAt: new Date(val.markedAt),
  }
}
