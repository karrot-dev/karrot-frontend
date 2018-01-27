import axios, { parseCursor } from '@/services/axios'

export default {

  async create (data) {
    return convertDate((await axios.post('/api/messages/', data)).data)
  },

  async list (conversationId) {
    const response = (await axios.get('/api/messages/', { params: { conversation: conversationId } })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convertDate(response.results),
    }
  },

  async listMore (cursor) {
    const response = (await axios.get(cursor)).data
    return {
      ...response,
      next: parseCursor(response.next),
      prev: parseCursor(response.prev),
      results: convertDate(response.results),
    }
  },
}

export function convertDate (val) {
  if (Array.isArray(val)) {
    return val.map(convertDate)
  }
  else {
    const createdAt = new Date(val.createdAt)
    return { ...val, createdAt }
  }
}
