import { toggles } from '@/utils/datastore/helpers'

export default {
  namespaced: true,
  modules: {
    toggle: toggles({
      away: false,
    }),
  },
}
