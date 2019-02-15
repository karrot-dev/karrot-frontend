import { toggles } from '@/utils/datastore/helpers'

export default {
  namespaced: true,
  modules: {
    toggle: toggles({
      place: true,
      places: true,
      group: true,
      placesOnMap: true,
      usersOnMap: false,
      groupsOnMap: false,
    }),
  },
}
