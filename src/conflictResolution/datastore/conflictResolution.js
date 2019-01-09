import router from '@/base/router'

function initialState () {
  return {
    entries: {
      1: {
        'id': 1,
        'submitDate': '',
        'group': 13,
        'ppp': 4,
        'initiator': 1,
        'initialStatement': 'He is so unreliable and I cannot stand him!',
      },
    },
  }
}
export default {
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => conflictId => {
      return getters.enrich(state.entries[conflictId])
    },
  },
  actions: {
    startSetup ({ dispatch }) {
      router.push({ name: 'conflictResolutionSetup', params: { groupId: currentGroup.id } })
    },
  },
}
