import groups from '@/services/api/groups'
import { withMeta, createMetaModule } from '@/store/helpers'

function initialState () {
  return {
    timezones: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    autocompleteData: state => {
      // q-autocomplete static data format
      if (state.timezones) {
        const tzlist = state.timezones.allTimezones.map(tz => ({ label: tz, value: tz }))
        return {
          field: 'value',
          list: tzlist,
        }
      }
      return {}
    },
  },
  actions: {
    ...withMeta({
      async fetch ({ commit }) {
        const timezones = await groups.timezones()
        commit('set', { timezones })
      },
    }),
  },
  mutations: {
    set (state, timezones) {
      state.timezones = timezones
    },
  },
}
