import { toggles } from '@/utils/datafoo/helpers'

export default {
  namespaced: true,
  modules: {
    toggle: toggles({
      away: false,
    }),
  },
}
