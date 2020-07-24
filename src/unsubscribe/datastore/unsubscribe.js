import { withMeta, createMetaModule, metaStatuses } from '@/utils/datastore/helpers'
import unsubscribeAPI from '@/unsubscribe/api/unsubscribe'

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  getters: {
    ...metaStatuses(['allEmailsPerGroup']),
  },
  actions: {
    ...withMeta({
      async allEmailsPerGroup ({ dispatch }, groupId) {
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
    clear ({ dispatch }) {
      dispatch('meta/clear')
    },
  },
}
