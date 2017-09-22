import i18n from '@/i18n'

export const types = {
  SET_ALL_BREADCRUMBS: 'Set all breadcrumbs',
}

export const state = {
  breadcrumbs: [],
}

export const getters = {
  all: (state, getters, rootState, rootGetters) => {
    return state.breadcrumbs.map((item, idx) => {
      if (item.type === 'activeGroup') {
        let group = rootGetters['groups/activeGroup']
        if (group) {
          return {
            name: group.name,
            route: { name: 'group', groupId: group.id },
          }
        }
      }
      else if (item.type === 'activeStore') {
        let store = rootGetters['stores/activeStore']
        if (store) {
          return {
            name: store.name,
            route: { name: 'store', groupId: store.id },
          }
        }
      }
      else if (item.type === 'activeUser') {
        let user = rootGetters['users/activeUser']
        if (user) {
          return {
            name: user.displayName,
            route: { name: 'user', userId: user.id },
          }
        }
      }
      if (item.type === 'activeGroupInfo') {
        let group = rootGetters['groups/activeGroupInfo']
        if (group) {
          return {
            name: group.name,
            route: { name: 'groupInfo', groupInfoId: group.id },
          }
        }
      }
      else if (item.translation) {
        return { ...item, name: i18n.t(item.translation) }
      }

      return item
    })
  },
  allNames: (state, getters) => getters.all.map(item => item.name).filter(item => item),
}

export const actions = {

  setAll ({ commit }, { breadcrumbs }) {
    commit(types.SET_ALL_BREADCRUMBS, { breadcrumbs })
  },

}

export const mutations = {
  [types.SET_ALL_BREADCRUMBS] (state, { breadcrumbs }) {
    state.breadcrumbs = breadcrumbs
  },
}
