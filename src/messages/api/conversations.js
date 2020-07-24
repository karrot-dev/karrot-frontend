import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertMessage } from './messages'
import { convert as convertActivity } from '@/activities/api/activities'
import { convert as convertApplication } from '@/applications/api/applications'
import { convert as convertIssue } from '@/issues/api/issues'
import { convert as convertOffer } from '@/offers/api/offers'

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

  async markConversationsSeen () {
    return (await axios.post('/api/conversations/mark_conversations_seen/')).data
  },

  async markThreadsSeen () {
    return (await axios.post('/api/conversations/mark_threads_seen/')).data
  },
}

function convertListResults (results) {
  return {
    conversations: convert(results.conversations),
    messages: convertMessage(results.messages),
    activities: convertActivity(results.activities),
    applications: convertApplication(results.applications),
    issues: convertIssue(results.issues),
    offers: convertOffer(results.offers),
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
    conversationsMarkedAt: new Date(val.conversationsMarkedAt),
    threadsMarkedAt: new Date(val.threadsMarkedAt),
  }
}
