import i18n from '@/base/i18n'

function initialState () {
  return {
    breadcrumbs: [],
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    all: (state, getters, rootState, rootGetters) => {
      return state.breadcrumbs.map((item, idx) => {
        if (item.type === 'currentGroup') {
          let group = rootGetters['currentGroup/value']
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
              route: { name: 'store', storeId: store.id },
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
        if (item.type === 'activeGroupPreview') {
          let group = rootGetters['groups/activePreview']
          if (group) {
            return {
              name: group.name,
              route: { name: 'groupPreview', groupPreviewId: group.id },
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
  },
  actions: {
    setAll ({ commit }, breadcrumbs) {
      commit('setAllBreadcrumbs', { breadcrumbs })
    },
  },
  mutations: {
    setAllBreadcrumbs (state, { breadcrumbs }) {
      state.breadcrumbs = breadcrumbs
    },
  },
}
