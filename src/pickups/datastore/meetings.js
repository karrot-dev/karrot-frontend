import { createEventModule } from '@/pickups/datastore/helpers'
import meetingAPI from '@/pickups/api/meetings'

const module = createEventModule({
  api: meetingAPI,
})

export default {
  ...module,
  actions: {
    ...module.actions,
    async beforeEnter ({ dispatch }, { groupId }) {
      await dispatch('fetchListByGroupId', groupId)
    },
  },
}
