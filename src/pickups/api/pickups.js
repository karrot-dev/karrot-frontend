import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

export default {

  async create (pickup) {
    return convert((await axios.post('/api/pickup-dates/', convertDateToRange(pickup))).data)
  },

  async get (pickupId) {
    return convert((await axios.get(`/api/pickup-dates/${pickupId}/`)).data)
  },

  async list (filter) {
    const params = filter || { 'date_min': new Date() }
    const response = (await axios.get('/api/pickup-dates/', { params })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convert(response.results),
    }
  },

  async listByGroupId (groupId) {
    return this.list({ group: groupId, 'date_min': new Date() })
  },

  async listByPlaceId (placeId) {
    return this.list({ place: placeId, 'date_min': new Date() })
  },

  async listBySeriesId (seriesId) {
    return this.list({ series: seriesId, 'date_min': new Date() })
  },

  async listFeedbackPossible (groupId) {
    return this.list({ feedback_possible: true, group: groupId })
  },

  async save (pickup) {
    return convert((await axios.patch(`/api/pickup-dates/${pickup.id}/`, convertDateToRange(pickup))).data)
  },

  async join (pickupId) {
    return convert((await axios.post(`/api/pickup-dates/${pickupId}/add/`, {})).data)
  },

  async leave (pickupId) {
    return convert((await axios.post(`/api/pickup-dates/${pickupId}/remove/`, {})).data)
  },

  async conversation (pickupId) {
    return convertConversation((await axios.get(`/api/pickup-dates/${pickupId}/conversation/`)).data)
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

export function convertDateToRange (pickup) {
  const result = { ...pickup }
  if (pickup.date) {
    result.date = [pickup.date]
  }
  if (pickup.dateEnd) {
    if (!result.date) result.date = []
    result.date[1] = pickup.dateEnd
    delete result.dateEnd
  }
  return result
}
