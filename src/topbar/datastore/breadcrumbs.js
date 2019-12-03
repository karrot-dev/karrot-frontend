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
      return state.breadcrumbs.map(item => {
        if (item.type === 'currentGroup') {
          const group = rootGetters['currentGroup/value']
          if (group) {
            return {
              name: group.name,
              route: { name: 'group', groupId: group.id },
            }
          }
        }
        else if (item.type === 'activePlace') {
          const place = rootGetters['places/activePlace']
          if (place) {
            return {
              name: place.name,
              route: { name: 'place', placeId: place.id },
            }
          }
        }
        else if (item.type === 'activeUser') {
          const user = rootGetters['users/activeUser']
          if (user) {
            return {
              name: user.displayName,
              route: { name: 'user', userId: user.id },
            }
          }
        }
        else if (item.type === 'activeGroupPreview') {
          const group = rootGetters['groups/activePreview']
          if (group) {
            return {
              name: group.name,
              route: { name: 'groupPreview', groupPreviewId: group.id },
            }
          }
        }
        else if (item.type === 'activeIssue') {
          const issue = rootGetters['issues/current']
          if (issue) {
            return {
              name: issue.affectedUser.displayName,
            }
          }
        }
        else if (item.type === 'activeOffer') {
          const offer = rootGetters['currentOffer/value']
          if (offer) {
            return {
              name: offer.name,
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
  mutations: {
    set (state, breadcrumbs) {
      state.breadcrumbs = breadcrumbs
    },
  },
}
