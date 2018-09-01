import axios, { parseCursor } from '@/services/axios'

export default {

  async create (data) {
    return convert((await axios.post('/api/messages/', data)).data)
  },

  async save (data) {
    return convert((await axios.patch(`/api/messages/${data.id}/`, data)).data)
  },

  async markThread (messageId, seenUpTo) {
    return convert((await axios.patch(`/api/messages/${messageId}/thread/`, {
      seenUpTo,
    })).data)
  },

  async setMuted (messageId, muted) {
    return convert((await axios.patch(`/api/messages/${messageId}/thread/`, {
      muted,
    })).data)
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

  async listMyThreads () {
    const response = (await axios.get('/api/messages/my_threads/')).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convertListMyThreadsResult(response.results),
    }
  },

  async listMyThreadsMore (cursor) {
    const response = (await axios.get(cursor)).data
    return {
      ...response,
      next: parseCursor(response.next),
      prev: parseCursor(response.prev),
      results: convertListMyThreadsResult(response.results),
    }
  },
}

export function convertListMyThreadsResult (results) {
  return {
    threads: convert(results.threads),
    messages: convert(results.messages),
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
      updatedAt: new Date(val.updatedAt),
      editedAt: new Date(val.editedAt),
    }
  }
}
