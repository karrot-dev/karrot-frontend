import axios, { parseCursor } from '@/services/axios'

export default {

  async create (pickup) {
    return convertDate((await axios.post('/api/pickup-dates/', pickup)).data)
  },

  async get (pickupId) {
    return convertDate((await axios.get(`/api/pickup-dates/${pickupId}/`)).data)
  },

  async list (filter) {
    const params = filter || { 'date_0': new Date() }
    const response = (await axios.get('/api/pickup-dates/', { params })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convertDate(response.results),
    }
  },

  async listByGroupId (groupId) {
    return this.list({ group: groupId, 'date_0': new Date() })
  },

  async listByStoreId (storeId) {
    return this.list({ store: storeId, 'date_0': new Date() })
  },

  async listBySeriesId (seriesId) {
    return this.list({ series: seriesId, 'date_0': new Date() })
  },

  async listFeedbackPossible (groupId) {
    return this.list({ feedback_possible: true, group: groupId })
  },

  async save (pickup) {
    return convertDate((await axios.patch(`/api/pickup-dates/${pickup.id}/`, pickup)).data)
  },

  async delete (pickupId) {
    return (await axios.delete(`/api/pickup-dates/${pickupId}/`)).data
  },

  async join (pickupId) {
    return convertDate((await axios.post(`/api/pickup-dates/${pickupId}/add/`, {})).data)
  },

  async leave (pickupId) {
    return convertDate((await axios.post(`/api/pickup-dates/${pickupId}/remove/`, {})).data)
  },

}

export function convertDate (val) {
  if (Array.isArray(val)) {
    return val.map(convertDate)
  }
  else {
    let date = new Date(val.date)
    return { ...val, date }
  }
}
