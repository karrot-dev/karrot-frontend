import axios from '@/base/api/axios'

export default {
  async create (data) {
    return (await axios.post('/api/auth/user/', data)).data
  },

  async get () {
    return (await axios.get('/api/auth/user/')).data
  },

  async save (obj) {
    let data = obj
    if (obj.photo) {
      data = new FormData()
      data.append('photo', obj.photo, 'photo.jpeg')
    }
    return (await axios.patch('/api/auth/user/', data)).data
  },

  delete (id) {
    return axios.delete(`/api/auth/user/`)
  },

  async getFailedEmailDeliveries () {
    return convert((await axios.get('/api/auth/user/failed_email_deliveries/')).data.results)
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
