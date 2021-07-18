import router from '@/router'
import feedbackAPI from '@/feedback/api/feedback'
import { createMetaModule, withMeta, metaStatuses, createPaginationModule, indexById } from '@/utils/datastore/helpers'

function initialState () {
  return {
    entries: {},
    selectedFeedbackId: null,
  }
}

export default {
  namespaced: true,
  modules: {
    meta: createMetaModule(),
    pagination: createPaginationModule(),
  },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => id => {
      return getters.enrich(state.entries[id])
    },
    enrich: (state, getters, rootState, rootGetters) => feedback => {
      if (!feedback) return
      const activity = rootGetters['activities/get'](feedback.about)
      return {
        ...feedback,
        givenBy: rootGetters['users/get'](feedback.givenBy),
        about: activity,
        place: activity && activity.place,
        group: activity && activity.group,
      }
    },
    all: (state, getters) => Object.values(state.entries).map(getters.enrich).sort(sortByActivityDateOrCreated),
    byCurrentGroup: (state, getters) => {
      return getters.all.filter(({ group }) => group && group.isCurrentGroup)
    },
    byActivePlace: (state, getters) => {
      return getters.all.filter(({ place }) => place && place.isActivePlace)
    },
    selectedId: (state) => state.selectedFeedbackId,
    selected: (state, getters) => getters.get(state.selectedFeedbackId),
    canFetchPast: (state, getters) => getters['pagination/canFetchNext'],
    ...metaStatuses(['save', 'fetch', 'fetchPast']),
  },
  actions: {
    ...withMeta({
      async fetch ({ dispatch }, { groupId, placeId }) {
        const filters = placeId ? { place: placeId } : { group: groupId }
        const data = await dispatch('pagination/extractCursor', feedbackAPI.list(filters))
        dispatch('updateFeedbackAndRelated', data)
      },
      async fetchPast ({ dispatch }) {
        const data = await dispatch('pagination/fetchNext', feedbackAPI.listMore)
        dispatch('updateFeedbackAndRelated', data)
      },

      async save ({ commit, getters }, feedback) {
        let entry
        if (feedback.id) {
          entry = await feedbackAPI.save(feedback)
        }
        else {
          entry = await feedbackAPI.create(feedback)
        }
        await commit('update', [entry])

        // In order to redirect to the placeFeedback page, we need to find the place id
        // It's not part of plain saved feedback, so we need to get it from _enriched_ feedback
        const enrichedFeedback = getters.get(entry.id)
        const placeId = enrichedFeedback.place.id
        router.push({ name: 'placeFeedback', params: { placeId }, query: { highlight: entry.id } }).catch(() => {})
      },

      async updateOne ({ commit, dispatch }, feedback) {
        dispatch('fetchRelatedActivities', [feedback])
        commit('update', [feedback])
      },
    }, {
      // ignore ID to have simple saveStatus
      findId: () => undefined,
    }),

    updateFeedbackAndRelated ({ commit }, { feedback, activities }) {
      if (feedback) commit('update', feedback)
      if (activities) {
        commit('activities/update', activities, { root: true })
      }
    },

    async fetchRelatedActivities ({ dispatch }, feedbackList) {
      for (const f of feedbackList) {
        dispatch('activities/maybeFetch', f.about, { root: true })
      }
    },

    ...withMeta({
      async select ({ dispatch, commit }, { groupId, feedbackId }) {
        if (feedbackId) {
          dispatch('fetch', { groupId }) // ideally we would have the placeId here too, but it's not in the route
          commit('update', [await feedbackAPI.get(feedbackId)])
        }
      },
    }, {
      findId: ({ feedbackId }) => feedbackId,
      setCurrentId: ({ commit }, { feedbackId }) => commit('select', feedbackId),
      getCurrentId: ({ state }) => state.selectedFeedbackId,
    }),

    clear ({ commit }) {
      commit('clear')
    },

  },
  mutations: {
    update (state, entries) {
      state.entries = { ...state.entries, ...indexById(entries) }
    },
    select (state, feedbackId) {
      state.selectedFeedbackId = feedbackId
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

function sortDateFor (feedback) {
  return feedback.about ? feedback.about.date : feedback.createdAt
}

export function sortByActivityDateOrCreated (a, b) {
  return sortDateFor(b) - sortDateFor(a)
}

export const plugin = datastore => {
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('feedback/clear')
      datastore.commit('feedback/pagination/clear')
    }
  })
}
