import axios, { parseCursor } from '@/services/axios'
import { convert as convertConversation } from '@/services/api/conversations'

export default {

  async create (pickup) {
    return convert((await axios.post('/api/pickup-dates/', pickup)).data)
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

  async listByStoreId (storeId) {
    return this.list({ store: storeId, 'date_min': new Date() })
  },

  async listBySeriesId (seriesId) {
    return this.list({ series: seriesId, 'date_min': new Date() })
  },

  async listFeedbackPossible (groupId) {
    return this.list({ feedback_possible: true, group: groupId })
  },

  async save (pickup) {
    return convert((await axios.patch(`/api/pickup-dates/${pickup.id}/`, pickup)).data)
  },

  async delete (pickupId) {
    return (await axios.delete(`/api/pickup-dates/${pickupId}/`)).data
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
    let date = new Date(val.date)
    return { ...val, date }
  }
}
