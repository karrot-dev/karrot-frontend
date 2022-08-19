import { convert as convertActivities } from '@/activities/api/activities'
import { convert as convertApplications } from '@/applications/api/applications'
import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertIssues } from '@/issues/api/issues'

export default {
  async list (filter) {
    const response = (await axios.get('/api/notifications/', { params: filter })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convertListResults(response.results),
    }
  },

  async markClicked (id) {
    return (await axios.post(`/api/notifications/${id}/mark_clicked/`)).data
  },

  async markSeen () {
    return (await axios.post('/api/notifications/mark_seen/')).data
  },
}

function convertListResults (results) {
  return {
    notifications: convert(results.notifications),
    activities: convertActivities(results.activities),
    issues: convertIssues(results.issues),
    applications: convertApplications(results.applications),
    // TODO meta not needed anymore? remove from API
    // meta: convertMeta(results.meta),
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
      expiresAt: val.expiresAt && new Date(val.expiresAt),
    }
  }
}

export function convertMeta (val) {
  return {
    ...val,
    markedAt: new Date(val.markedAt),
  }
}
