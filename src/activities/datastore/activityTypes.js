import activityTypes from '@/activities/api/activityTypes'
import { indexById } from '@/utils/datastore/helpers'
import i18n from '@/base/i18n'

function initialState () {
  return {
    entries: {},
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    get: (state, getters) => activityTypeId => {
      return getters.enrich(state.entries[activityTypeId])
    },
    all: (state, getters) => Object.values(state.entries).map(getters.enrich),
    enrich: state => activityType => {
      if (!activityType) return
      const { id, name, nameIsDefault } = activityType
      const colorName = `activity-type-${id}`
      return {
        ...activityType,
        colorName,
        name: nameIsDefault ? i18n.t(`ACTIVITY_TYPE_NAMES.${name.toUpperCase()}`) : name,
      }
    },
    byCurrentGroup: (state, getters, rootState, rootGetters) => {
      return getters.all.filter(({ group }) => group === rootGetters['currentGroup/id'])
    },
  },
  actions: {
    async fetch ({ commit }, { groupId }) {
      commit('update', await activityTypes.list({ group: groupId }))
    },
  },
  mutations: {
    clear (state) {
      Object.assign(state, initialState())
    },
    update (state, activityTypes) {
      state.entries = Object.freeze({ ...state.entries, ...indexById(activityTypes) })
    },
  },
}
