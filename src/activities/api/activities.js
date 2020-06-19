import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

export default {

  async create (activity) {
    return convert((await axios.post('/api/pickup-dates/', convertDateToRange(activity))).data)
  },

  async get (activityId) {
    return convert((await axios.get(`/api/pickup-dates/${activityId}/`)).data)
  },

  async list (filter) {
    const params = filter || { date_min: new Date() }
    const response = (await axios.get('/api/pickup-dates/', { params })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convert(response.results),
    }
  },

  async listByGroupId (groupId) {
    return this.list({ group: groupId, date_min: new Date() })
  },

  async listByPlaceId (placeId) {
    return this.list({ place: placeId, date_min: new Date() })
  },

  async listBySeriesId (seriesId) {
    return this.list({ series: seriesId, date_min: new Date() })
  },

  async listFeedbackPossible (groupId) {
    return this.list({ feedback_possible: true, group: groupId })
  },

  async save (activity) {
    return convert((await axios.patch(`/api/pickup-dates/${activity.id}/`, convertDateToRange(activity))).data)
  },

  async join (activityId) {
    return convert((await axios.post(`/api/pickup-dates/${activityId}/add/`, {})).data)
  },

  async leave (activityId) {
    return convert((await axios.post(`/api/pickup-dates/${activityId}/remove/`, {})).data)
  },

  async conversation (activityId) {
    return convertConversation((await axios.get(`/api/pickup-dates/${activityId}/conversation/`)).data)
  },

}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    const result = { ...val }

    if (val.feedbackDue) {
      result.feedbackDue = new Date(val.feedbackDue)
    }

    if (val.date) {
      result.date = new Date(val.date[0])
      result.dateEnd = new Date(val.date[1])
    }

    return result
  }
}

export function convertDateToRange (activity) {
  const result = { ...activity }
  if (activity.date) {
    result.date = [activity.date]
  }
  if (activity.dateEnd) {
    if (!result.date) result.date = []
    result.date[1] = activity.dateEnd
    delete result.dateEnd
  }
  return result
}
