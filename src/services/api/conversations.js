import axios, { parseCursor } from '@/services/axios'
import { convert as convertMessage } from './messages'

export default {
  async get (id) {
    return convert((await axios.get(`/api/conversations/${id}/`)).data)
  },

  async list () {
    const response = (await axios.get('/api/conversations/')).data
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

  async mark (id, data) {
    return (await axios.post(`/api/conversations/${id}/mark/`, data)).data
  },

  async toggleEmailNotifications (id, value) {
    const data = { 'emailNotifications': value }
    return (await axios.post(`/api/conversations/${id}/email_notifications/`, data)).data
  },
}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    return {
      ...val,
      updatedAt: new Date(val.updatedAt),
      latestMessage: val.latestMessage && convertMessage(val.latestMessage),
    }
  }
}
