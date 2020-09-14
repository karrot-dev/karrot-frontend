import axios from '@/base/api/axios'
import { underscorizeKeys } from '@/utils/utils'

export default {
  async activityHistory ({ group, user, dateAfter, dateBefore }) {
    return (await axios.get(
      '/api/stats/activity-history/',
      { params: underscorizeKeys({ group, user, dateAfter, dateBefore }) },
    )).data
  },
}
