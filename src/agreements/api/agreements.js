import axios, { parseCursor } from '@/base/api/axios'
import { underscorizeKeys } from '@/utils/utils'

export default {

  async create (agreement) {
    return convert((await axios.post('/api/agreements/', agreement)).data)
  },

  async get (agreementId) {
    return convert((await axios.get(`/api/agreements/${agreementId}/`)).data)
  },

  async list (params = {}) {
    const response = (await axios.get('/api/agreements/', { params: underscorizeKeys(params) })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convert(response.results),
    }
  },

  async save (agreement) {
    return convert((await axios.patch(`/api/agreements/${agreement.id}/`, agreement)).data)
  },
}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    const result = { ...val }

    const dateFields = [
      'activeFrom',
      'activeUntil',
      'reviewAt',
    ]

    for (const field of dateFields) {
      if (val[field]) {
        result[field] = new Date(val[field])
      }
    }

    return result
  }
}
