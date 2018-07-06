import Vue from 'vue'
import router from '@/router'
import feedbackAPI from '@/services/api/feedback'
import { indexById, createMetaModule, withMeta, metaStatuses, createPaginationModule } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
    idList: [],
    idListScope: { type: null, id: null }, // what kind of data currently is loaded in idList
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
      return feedback && {
        ...feedback,
        givenBy: rootGetters['users/get'](feedback.givenBy),
        about: rootGetters['pickups/get'](feedback.about),
      }
    },
    all: (state, getters) => state.idList.map(getters.get),
    selected: (state, getters) => getters.get(state.selectedFeedbackId),
    ...metaStatuses(['save', 'fetch']),
  },
  actions: {
    ...withMeta({
      async fetch ({ state, dispatch, commit }, { filters, scope }) {
        // only clear if scope changed
        const {type, id} = state.idListScope
        if (scope.type !== type || scope.id !== id) {
          dispatch('clear')
          commit('setScope', scope)
        }
        const data = await dispatch('pagination/extractCursor', feedbackAPI.list(filters))
        // check for race condition when switching pages
        if (type !== state.idListScope.type || id !== state.idListScope.id) return
        commit('update', data)

        dispatch('fetchRelatedPickups', data)
      },
      async fetchMore ({ state, dispatch, commit }) {
        const { type, id } = state.idListScope
        const data = await dispatch('pagination/fetchMore', feedbackAPI.listMore)
        // check for race condition when switching pages
        if (type !== state.idListScope.type || id !== state.idListScope.id) return
        commit('update', data)

        dispatch('fetchRelatedPickups', data)
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

      async update ({ state, commit, rootGetters, dispatch }, feedback) {
        await dispatch('pickups/maybeFetch', feedback.about, { root: true })
        const pickup = rootGetters['pickups/get'](feedback.about)
        const currentUserId = rootGetters['auth/userId']

        // make sure that feedback belongs to scope
        const {type, id} = state.idListScope
        const fitsStoreScope = () => type === 'store' && pickup.store && pickup.store.id === id
        const fitsGroupScope = () => type === 'group' && pickup.store && pickup.store.group && pickup.store.group.id === id
        if (fitsStoreScope() || fitsGroupScope()) {
          commit('update', [feedback])
          if (feedback.givenBy === currentUserId) {
            dispatch('pickups/removeFeedbackPossible', feedback.about, { root: true })
          }
        }
      },
    }, {
      // ignore ID to have simple saveStatus
      findId: () => undefined,
    }),

    fetchForGroup ({ dispatch }, { groupId }) {
      dispatch('fetch', {
        filters: { group: groupId },
        scope: { type: 'group', id: groupId },
      })
    },
    fetchForStore ({ dispatch, commit }, { groupId, storeId }) {
      dispatch('fetch', {
        filters: { store: storeId },
        scope: { type: 'store', id: storeId },
      })
    },

    async fetchRelatedPickups ({ dispatch }, feedbackList) {
      for (const f of feedbackList) {
        dispatch('pickups/maybeFetch', f.about, { root: true })
      }
    },

    async select ({ dispatch, commit }, { groupId, feedbackId }) {
      if (feedbackId) {
        dispatch('fetchForGroup', { groupId }) // ideally we would have the storeId here too, but it's not in the route
        commit('update', [await feedbackAPI.get(feedbackId)])
        commit('select', feedbackId)
      }
    },

    refresh ({ state, dispatch }) {
      const {type, id} = state.idListScope
      switch (type) {
        case 'group': return dispatch('fetchForGroup', { groupId: id })
        case 'store': return dispatch('fetchForStore', { storeId: id })
      }
    },

    clear ({ commit }) {
      commit('clear')
    },

  },
  mutations: {
    setScope (state, { type, id }) {
      state.idListScope.type = type
      state.idListScope.id = id
    },
    update (state, entries) {
      state.entries = {
        ...state.entries,
        ...indexById(entries),
      }
      // simple insertion sort for new entries
      // assumes that state.entries are sorted AND incoming entries are sorted
      const newIds = entries.map(e => e.id).filter(e => !state.idList.includes(e))
      let i = 0
      for (let id of newIds) {
        const createdAt = state.entries[id].createdAt
        while (i < state.idList.length && state.entries[state.idList[i]].createdAt > createdAt) i++
        state.idList.splice(i, 0, id)
      }
    },
    select (state, feedbackId) {
      state.selectedFeedbackId = feedbackId
    },
    clear (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
  },
}
