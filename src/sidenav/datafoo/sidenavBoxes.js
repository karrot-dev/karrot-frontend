import { toggles } from '@/utils/datafoo/helpers'

export default {
  namespaced: true,
  modules: {
    toggle: toggles({
      store: true,
      stores: true,
      group: true,
      storesOnMap: true,
      usersOnMap: false,
      groupsOnMap: false,
    }),
  },
}
