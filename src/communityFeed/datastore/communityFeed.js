import communityFeedAPI from '@/communityFeed/api/communityFeed'

function initialState () {
  return {
    topics: [],
    meta: {
      markedAt: null,
    },
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    topics: state => state.topics.map(topic => ({
      ...topic,
      isUnread: state.meta.markedAt && topic.lastPostedAt > state.meta.markedAt,
    })).sort((a, b) => b.lastPostedAt - a.lastPostedAt),
    unreadCount: (state, getters) => getters.topics.filter(t => t.isUnread).length,
  },
  actions: {
    async fetchTopics ({ commit }) {
      commit('setTopics', await communityFeedAPI.latestTopics())
    },
    async fetchMeta ({ commit }) {
      commit('setMeta', await communityFeedAPI.getMeta())
    },
    mark ({ rootGetters }) {
      if (!rootGetters['auth/isLoggedIn']) return
      communityFeedAPI.markSeen()
    },
  },
  mutations: {
    setTopics (state, topics) {
      state.topics = topics
    },
    setMeta (state, meta) {
      state.meta = meta
    },
    clearMeta (state) {
      state.meta = initialState().meta
    },
  },
}

export function plugin (datastore) {
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) {
      datastore.dispatch('communityFeed/fetchMeta')
    }
    else {
      datastore.commit('communityFeed/clearMeta')
    }
  })
}
