import groups from '@/group/api/groups'
import { withMeta, createMetaModule } from '@/utils/datastore/helpers'

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
      // QAutocomplete static data format
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
        commit('set', await groups.timezones())
      },
    }),
  },
  mutations: {
    set (state, timezones) {
      state.timezones = timezones
    },
  },
}
