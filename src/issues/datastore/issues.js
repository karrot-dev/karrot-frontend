function initialState () {
  return {
    entries: {
      1: {
        'id': 1,
        'createdAt': '2019-01-15T11:13:17.828Z',
        'group': 13,
        'affectedUser': 4,
        'createdBy': 1,
        'topic': 'He is so unreliable and I cannot stand him!',
      },
    },
  }
}
export default {
  state: initialState(),
  getters: {
    get: (state, getters) => issueId => {
      return getters.enrich(state.entries[issueId])
    },
    enrich: (state, getters, rootState, rootGetters) => issue => {
      return issue && {
        ...issue,
        affectedUser: rootGetters['users/get'](issue.affectedUser),
        group: rootGetters['groups/get'](issue.group),
        createdBy: rootGetters['users/get'](issue.createdBy),
      }
    }
  },
  actions: {
    createIssue (data) {
      router.push({ name: 'issueTabs', params: { groupId: data.group.id, issueId: data.id } })
    }
  }
}
