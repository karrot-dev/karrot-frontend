import axios from '@/base/api/axios'

export default {
  async get (groupId) {
    return (await axios.get(`/api/groups-info/${groupId}/`)).data
  },

  async list () {
    return (await axios.get('/api/groups-info/')).data
  },
}
