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
        if (item.type === 'activeGroupPreview') {
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
        // These are now handled in the breadcrumbs component as we need to use setup() function
        else if (
          item.type === 'currentGroup' ||
          item.type === 'activeOffer' ||
          item.type === 'activePlace' ||
          item.type === 'activeUser'
        ) {
          return item
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
