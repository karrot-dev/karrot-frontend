import { reactive, toRefs } from 'vue'

import { defineService } from '@/utils/datastore/helpers'

export const useMapToggles = defineService(() => {
  const state = reactive({
    showPlaces: true,
    showUsers: false,
    showGroups: false,
  })

  function togglePlaces () {
    state.showPlaces = !state.showPlaces
  }

  function toggleUsers () {
    state.showUsers = !state.showUsers
  }

  function toggleGroups () {
    state.showGroups = !state.showGroups
  }

  return {
    ...toRefs(state),

    togglePlaces,
    toggleUsers,
    toggleGroups,
  }
})
