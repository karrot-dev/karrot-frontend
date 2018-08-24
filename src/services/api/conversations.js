import axios, { parseCursor } from '@/services/axios'
import { convert as convertMessage } from './messages'
import { convert as convertPickup } from './pickups'
import { convert as convertApplication } from './groupApplications'

export default {
  async get (id) {
    return convert((await axios.get(`/api/conversations/${id}/`)).data)
  },

  async list (group) {
    const response = (await axios.get('/api/conversations/', { params: {
      group,
      exclude_wall: 'True',
    }})).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: {
        conversations: convert(response.results.conversations),
        messages: convertMessage(response.results.messages),
        pickups: convertPickup(response.results.pickups),
        applications: convertApplication(response.results.applications),
      },
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
    }
  }
}
