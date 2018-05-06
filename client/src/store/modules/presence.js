import { toggles } from '@/store/helpers'

export default {
  namespaced: true,
  modules: {
    toggle: toggles({
      away: false,
    }),
  },
}
