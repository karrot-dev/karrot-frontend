import axios from '@/base/api/axios'
import { camelizeKeys } from '@/utils/utils'

export default {
  async activityHistory ({ group, user, dateAfter, dateBefore }) {
    return (await axios.get(
      '/api/stats/activity-history/',
      { params: camelizeKeys({ group, user, dateAfter, dateBefore }) },
    )).data
  },
}
