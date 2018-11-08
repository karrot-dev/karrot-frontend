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
        store: pickup && pickup.store,
        group: pickup && pickup.group,
      }
    },
    all: (state, getters) => Object.values(state.entries).map(getters.enrich).sort(sortByCreatedAt),
    byCurrentGroup: (state, getters) => {
      return getters.all.filter(({ group }) => group && group.isCurrentGroup)
    },
    byActiveStore: (state, getters) => {
      return getters.all.filter(({ store }) => store && store.isActiveStore)
    },
    selected: (state, getters) => getters.get(state.selectedFeedbackId),
    canFetchPast: (state, getters) => getters['pagination/canFetchNext'],
    ...metaStatuses(['save', 'fetch', 'fetchPast']),
  },
  actions: {
    ...withMeta({
      async fetch ({ dispatch }, { groupId, storeId }) {
        const filters = storeId ? { store: storeId } : { group: groupId }
        const data = await dispatch('pagination/extractCursor', feedbackAPI.list(filters))
        dispatch('updateFeedbackAndRelated', data)
      },
      async fetchPast ({ dispatch }) {
        const data = await dispatch('pagination/fetchNext', feedbackAPI.listMore)
        dispatch('updateFeedbackAndRelated', data)
      },

      async save ({ dispatch }, feedback) {
        let entry
        if (feedback.id) {
          entry = await feedbackAPI.save(feedback)
        }
        else {
          entry = await feedbackAPI.create(feedback)
        }
        await dispatch('update', entry)
        router.push({ name: 'groupFeedback' })
      },

      async updateOne ({ commit, rootGetters, dispatch }, feedback) {
        dispatch('fetchRelatedPickups', [feedback])
        commit('update', [feedback])

        const currentUserId = rootGetters['auth/userId']
        if (feedback.givenBy === currentUserId) {
          dispatch('pickups/removeFeedbackPossible', feedback.about, { root: true })
        }
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

    async select ({ dispatch, commit }, { groupId, feedbackId }) {
      if (feedbackId) {
        dispatch('fetch', { groupId }) // ideally we would have the storeId here too, but it's not in the route
        commit('update', [await feedbackAPI.get(feedbackId)])
        commit('select', feedbackId)
      }
    },

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
