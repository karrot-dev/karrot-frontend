import axios, { parseCursor } from '@/services/axios'
import { convert as convertMessage } from './messages'
import { convert as convertPickup } from './pickups'
import { convert as convertApplication } from './groupApplications'

export default {
  async get (id) {
    return convert((await axios.get(`/api/conversations/${id}/`)).data)
  },

  async list (filter) {
    const response = (await axios.get('/api/conversations/', { params: filter })).data
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

  async mark (id, data) {
    return (await axios.post(`/api/conversations/${id}/mark/`, data)).data
  },

  async toggleEmailNotifications (id, value) {
    const data = { 'emailNotifications': value }
    return (await axios.post(`/api/conversations/${id}/email_notifications/`, data)).data
  },
}

function convertListResults (results) {
  return {
    conversations: convert(results.conversations),
    messages: convertMessage(results.messages),
    pickups: convertPickup(results.pickups),
    applications: convertApplication(results.applications),
    usersInfo: results.usersInfo,
  }
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
