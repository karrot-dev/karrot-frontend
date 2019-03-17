import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertMessage } from './messages'
import { convert as convertPickup } from '@/pickups/api/pickups'
import { convert as convertApplication } from '@/applications/api/applications'
import { convert as convertIssue } from '@/issues/api/issues'

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

  async save (id, data) {
    return convert((await axios.patch(`/api/conversations/${id}/`, data)).data)
  },

  async markAllSeen () {
    return (await axios.post(`/api/conversations/mark_all_seen/`)).data
  },
}

function convertListResults (results) {
  return {
    conversations: convert(results.conversations),
    messages: convertMessage(results.messages),
    pickups: convertPickup(results.pickups),
    applications: convertApplication(results.applications),
    issues: convertIssue(results.issues),
    usersInfo: results.usersInfo,
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
      updatedAt: new Date(val.updatedAt),
    }
  }
}

export function convertMeta (val) {
  return {
    ...val,
    markedAt: new Date(val.markedAt),
  }
}
