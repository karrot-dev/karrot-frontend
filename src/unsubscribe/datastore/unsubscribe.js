import { withMeta, createMetaModule, metaStatuses } from '@/utils/datastore/helpers'
import unsubscribeAPI from '@/unsubscribe/api/unsubscribe'

function initialState () {
  return {
    counts: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    ...metaStatuses(['allEmailsPerGroup']),
    counts: (state) => state.counts,
  },
  actions: {
    ...withMeta({
      async allEmailsPerGroup ({ state, commit, dispatch }, groupId) {
        const counts = await unsubscribeAPI.unsubscribe({ group: groupId, choice: 'group' })
        const { conversations: formerConversations, threads: formerReplies } = counts
        dispatch('toasts/show', {
          message: 'UNSUBSCRIBE.COUNTS',
          messageParams: { formerConversations, formerReplies },
        }, { root: true })
      },
    }, {
      findId: () => undefined,
    }),
    clear ({ commit, dispatch }) {
      dispatch('meta/clear', ['allEmailsPerGroup'])
      commit('clear')
    },
  },
  mutations: {
    setCounts (state, counts) {
      state.counts = counts
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
