import axios from '@/services/axios'

export default {

  async create (pickup) {
    return convertDate((await axios.post('/api/pickup-dates/', this.$serialize(pickup))).data)
  },

  async get (pickupId) {
    return convertDate((await axios.get(`/api/pickup-dates/${pickupId}/`)).data)
  },

  async list () {
    return convertDate((await axios.get('/api/pickup-dates/', { params: { 'date_0': new Date() } })).data)
  },

  async listByGroupId (groupId) {
    return convertDate((await axios.get('/api/pickup-dates/', { params: { group: groupId, 'date_0': new Date() } })).data)
  },

  async listByStoreId (storeId) {
    return convertDate((await axios.get('/api/pickup-dates/', { params: { store: storeId, 'date_0': new Date() } })).data)
  },

  async listBySeriesId (seriesId) {
    return convertDate((await axios.get('/api/pickup-dates/', { params: { series: seriesId, 'date_0': new Date() } })).data)
  },

  async save (pickup) {
    return convertDate((await axios.patch(`/api/pickup-dates/${pickup.id}/`, pickup)).data)
  },

  async delete (pickupId) {
    return convertDate((await axios.delete(`/api/pickup-dates/${pickupId}/`)).data)
  },

  async join (pickupId) {
    return convertDate((await axios.post(`/api/pickup-dates/${pickupId}/add/`, {})).data)
  },

  async leave (pickupId) {
    return convertDate((await axios.post(`/api/pickup-dates/${pickupId}/remove/`, {})).data)
  }

}

function convertDate (val) {
  if (Array.isArray(val)) {
    return val.map(convertDate)
  }
  else {
    let date = new Date(val.date)
    return { ...val, date }
  }
}
