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
          if (group && group.id) {
            return {
              name: group.name,
              route: { name: 'group', params: { groupId: group.id } },
            }
          }
        }
        else if (item.type === 'activePlace') {
          const place = rootGetters['places/activePlace']
          if (place && place.group && place.group.id) {
            return {
              name: place.name,
              route: { name: 'place', params: { placeId: place.id, groupId: place.group.id } },
            }
          }
        }
        else if (item.type === 'activeUser') {
          const user = rootGetters['users/activeUser']
          if (user) {
            return {
              name: user.displayName,
              route: { name: 'user', params: { userId: user.id } },
            }
          }
        }
        else if (item.type === 'activeGroupPreview') {
          const group = rootGetters['groups/activePreview']
          if (group && group.id) {
            return {
              name: group.name,
              route: { name: 'groupPreview', params: { groupPreviewId: group.id } },
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
