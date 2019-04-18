import { createEventModule, sortByDate } from '@/pickups/datastore/helpers'
import pickupsAPI from '@/pickups/api/pickups'
import reactiveNow from '@/utils/reactiveNow'
import { withMeta, metaStatuses } from '@/utils/datastore/helpers'

const module = createEventModule({
  api: pickupsAPI,
  getters: {
  },
})

export default {
  ...module,
  getters: {
    ...module.getters,
    feedbackPossibleByCurrentGroup: (state, getters) => {
      return Object.values(state.entries)
        .filter(p => p.dateEnd < reactiveNow.value && p.feedbackDue > reactiveNow.value)
        .map(getters.enrich)
        .filter(p => p.isUserMember)
        .filter(p => p.group && p.group.isCurrentGroup)
        .filter(p => !p.feedbackGivenBy.find(u => u.isCurrentUser))
        .sort(sortByDate)
    },
    feedbackPossibleByActivePlace: (state, getters) =>
      getters.feedbackPossibleByCurrentGroup
        .filter(({ place }) => place && place.isActivePlace),
    enrich: (...ctx) => pickup => {
      const rootGetters = ctx[3]
      return {
        ...module.getters.enrich(...ctx)(pickup),
        feedbackGivenBy: pickup.feedbackGivenBy ? pickup.feedbackGivenBy.map(rootGetters['users/get']) : [],
      }
    },
    ...metaStatuses(['fetchFeedbackPossible']),
  },
  actions: {
    ...module.actions,
    ...withMeta({
      async fetchFeedbackPossible ({ commit }, groupId) {
        commit('update', (await pickupsAPI.listFeedbackPossible(groupId)).results)
      },
    }, {
      findId: () => null,
    }),
  },
}
