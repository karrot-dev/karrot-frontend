import Vue from 'vue'
import router from '@/base/router'
import feedbackAPI from '@/feedback/api/feedback'
import { createMetaModule, withMeta, metaStatuses, createPaginationModule } from '@/utils/datastore/helpers'

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
      const pickup = rootGetters['pickups/get'](feedback.about)
      return {
        ...feedback,
        givenBy: rootGetters['users/get'](feedback.givenBy),
        about: pickup,
        place: pickup && pickup.place,
        group: pickup && pickup.group,
      }
    },
    all: (state, getters) => Object.values(state.entries).map(getters.enrich).sort(sortByCreatedAt),
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

      async save ({ commit }, feedback) {
        let entry
        if (feedback.id) {
          entry = await feedbackAPI.save(feedback)
        }
        else {
          entry = await feedbackAPI.create(feedback)
        }
        await commit('update', [entry])
        router.push({ name: 'groupFeedback' })
      },

      async updateOne ({ commit, dispatch }, feedback) {
        dispatch('fetchRelatedPickups', [feedback])
        commit('update', [feedback])
      },
    }, {
      // ignore ID to have simple saveStatus
      findId: () => undefined,
    }),

    updateFeedbackAndRelated ({ commit }, { feedback, pickups }) {
      if (feedback) commit('update', feedback)
      if (pickups) {
        commit('pickups/update', pickups, { root: true })
      }
    },

    async fetchRelatedPickups ({ dispatch }, feedbackList) {
      for (const f of feedbackList) {
        dispatch('pickups/maybeFetch', f.about, { root: true })
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
      for (const entry of entries) {
        Vue.set(state.entries, entry.id, entry)
      }
    },
    select (state, feedbackId) {
      state.selectedFeedbackId = feedbackId
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export function sortByCreatedAt (a, b) {
  return b.createdAt - a.createdAt
}
