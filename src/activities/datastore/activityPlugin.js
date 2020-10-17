// import { fetchListByGroupId } from '@/activities/data/activities'

import { useGlobalActivities } from '@/activities/data'
import { watchEffect } from '@vue/composition-api'

export default datastore => {
  datastore.watch(state => state.currentGroup.id, currentGroupId => {
    if (!currentGroupId) return
    const { fetchListByGroupId, activityIds } = useGlobalActivities()
    // const { fetchListByGroupId } = require('@/activities/data/activities')
    console.log('fetchListByGroupId', fetchListByGroupId)
    const { pending, unhandledError, status, result } = fetchListByGroupId(currentGroupId)
    watchEffect(() => {
      console.log('pending/unhandledError/status is', pending.value, unhandledError.value, status.value)
    })

    watchEffect(() => {
      console.log('result?', result.value)
    })

    watchEffect(() => {
      console.log('can show activitiyIds in random places', activityIds.value)
    })

    datastore.dispatch('activities/fetchListByGroupId', currentGroupId, { root: true })
    datastore.dispatch('activities/fetchFeedbackPossible', currentGroupId, { root: true })
  }, { immediate: true })

  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('activities/clear')
    }
  })
}
