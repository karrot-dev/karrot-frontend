import axios from '@/services/axios'

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

export function convert (entry) {
  if (Array.isArray(entry)) {
    return entry.map(convert)
  }
  else {
    return {
      ...entry,
      startDate: new Date(entry.startDate),
      rule: convertRule(entry.rule),
    }
  }
}

export function serialize (entry) {
  if (entry.rule) {
    return {
      ...entry,
      rule: serializeRule(entry.rule),
    }
  }
  else {
    return entry
  }
}

export function convertRule (rule) {
  // takes rule string and returns object
  let parts = rule.split(';')
  let obj = {}
  for (let part of parts) {
    if (part.substr(0, 5) === 'BYDAY') {
      obj.byDay = part.substr(6).split(',')
    }
    else if (part.substr(0, 4) === 'FREQ') {
      obj.freq = part.substr(5)
    }
  }
  return obj
}

export function serializeRule (obj) {
  // takes rule object and return string
  return `FREQ=${obj.freq};BYDAY=${obj.byDay.join()}`
}
