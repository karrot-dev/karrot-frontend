import axios from '@/base/api/axios'

export default {
  async places ({ group, user, dateAfter, dateBefore }) {
    return (await axios.get('/api/stats/places/', { params: { group, user, date_after: dateAfter, date_before: dateBefore } })).data
  },
}
