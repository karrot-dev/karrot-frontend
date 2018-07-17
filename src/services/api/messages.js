import axios, { parseCursor } from '@/services/axios'

export default {

  async create (data) {
    return convert((await axios.post('/api/messages/', data)).data)
  },

  async save (data) {
    return convert((await axios.patch(`/api/messages/${data.id}/`, data)).data)
  },

  async modifyThreadSettings (messageId, data) {
    return convert((await axios.post(`/api/messages/${messageId}/thread/`, data)).data)
  },

  async get (id) {
    return convert((await axios.get(`/api/messages/${id}/`)).data)
  },

  async list (conversationId) {
    const response = (await axios.get('/api/messages/', { params: { conversation: conversationId } })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convert(response.results),
    }
  },

  async listThread (thread) {
    const response = (await axios.get('/api/messages/', { params: { thread } })).data
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
}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    const createdAt = new Date(val.createdAt)
    const updatedAt = new Date(val.updatedAt)
    return { ...val, createdAt, updatedAt }
  }
}
