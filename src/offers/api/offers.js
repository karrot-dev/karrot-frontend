import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'
import { toFormData } from '@/utils/utils'

export default {

  async create (offer) {
    return convert((await axios.post('/api/offers/', await toFormData(offer))).data)
  },

  async get (offerId) {
    return convert((await axios.get(`/api/offers/${offerId}/`)).data)
  },

  async list (filter) {
    const params = filter || {}
    const response = (await axios.get('/api/offers/', { params })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convert(response.results),
    }
  },

  async listMore (cursor) {
    const response = (await axios.get(cursor)).data
    return {
      ...response,
      next: parseCursor(response.next),
      prev: parseCursor(response.prev),
      results: convert(response.results),
    }
  },

  async save (offer) {
    return convert((await axios.patch(`/api/offers/${offer.id}/`, await toFormData(offer))).data)
  },

  async archive (offerId) {
    return convert((await axios.post(`/api/offers/${offerId}/archive/`)).data)
  },

  async conversation (offerId) {
    return convertConversation((await axios.get(`/api/offers/${offerId}/conversation/`)).data)
  },

}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    return {
      ...val,
      createdAt: new Date(val.createdAt),
    }
  }
}
