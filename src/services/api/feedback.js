import axios, { parseCursor } from '@/services/axios'

export default {
  async create (feedback) {
    return parse((await axios.post('/api/feedback/', feedback)).data)
  },

  async get (feedbackId) {
    return parse((await axios.get(`/api/feedback/${feedbackId}/`)).data)
  },

  async list (filter) {
    const response = (await axios.get('/api/feedback/', { params: filter })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: parse(response.results),
    }
  },

  async listMore (cursor) {
    const response = (await axios.get(cursor)).data
    return {
      ...response,
      next: parseCursor(response.next),
      prev: parseCursor(response.prev),
      results: parse(response.results),
    }
  },

  async save (feedback) {
    return parse((await axios.patch(`/api/feedback/${feedback.id}/`, feedback)).data)
  },
}

export function parse (val) {
  if (Array.isArray(val)) {
    return val.map(parse)
  }
  else {
    return {
      ...val,
      createdAt: new Date(val.createdAt),
      weight: val.weight ? parseFloat(val.weight) : undefined,
    }
  }
}
