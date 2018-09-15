import axios, { parseCursor } from '@/services/axios'

export default {
  async get (id) {
    return (await axios.get(`/api/notifications/${id}/`)).data
  },

  async list () {
    const response = (await axios.get('/api/notifications/')).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convert(response.results),
    }
  },

  async listMore (cursor) {
    const response = (await axios.get(cursor)).data
    return {
      ...response,
      next: parseCursor(response.next),
      prev: parseCursor(response.prev),
      results: convert(response.results),
    }
  },

  async delete (id) {
    return (await axios.delete(`/api/notifications/${id}/`)).data
  },
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
