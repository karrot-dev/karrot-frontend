import axios from '@/services/axios'

export default {
  async create (data) {
    return parseImageURLs((await axios.post('/api/auth/user/', data)).data)
  },

  async get () {
    return parseImageURLs((await axios.get('/api/auth/user/')).data)
  },

  async save (obj) {
    return parseImageURLs((await axios.patch('/api/auth/user/', obj)).data)
  },

  delete (id) {
    return axios.delete(`/api/auth/user/`)
  },
}

function parseImageURLs (data) {
  if (data.photoUrls) {
    data = {
      ...data,
      photoUrls: Object.entries(data.photoUrls).reduce((acc, cur) => {
        const [key, value] = cur
        acc[key] = parseImageURL(value)
        return acc
      }, {}),
    }
  }
  return data
}

function parseImageURL (val) {
  return val.substr(val.indexOf('/media'))
}
