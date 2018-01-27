import axios from '@/services/axios'
import { convert, serialize } from './pickupSeriesHelpers'

export default {

  async create (series) {
    return convert((await axios.post('/api/pickup-date-series/', serialize(series))).data)
  },

  async get (seriesId) {
    return convert((await axios.get(`/api/pickup-date-series/${seriesId}/`)).data)
  },

  async list () {
    return convert((await axios.get('/api/pickup-date-series/')).data)
  },

  async listByStoreId (storeId) {
    return convert((await axios.get('/api/pickup-date-series/', { params: { store: storeId } })).data)
  },

  async save (series) {
    let { id } = series
    return convert((await axios.patch(`/api/pickup-date-series/${id}/`, serialize(series))).data)
  },

  delete (seriesId) {
    return axios.delete(`/api/pickup-date-series/${seriesId}/`)
  },

}
