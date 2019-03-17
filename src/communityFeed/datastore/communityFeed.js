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
    })),
    unreadCount: (state, getters) => getters.topics.filter(t => t.isUnread).length,
  },
  actions: {
    async fetchTopics ({ commit }) {
      commit('setMeta', await communityFeedAPI.getMeta())
      commit('setTopics', await communityFeedAPI.latestTopics())
    },
    mark ({ commit }) {
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
  },
}
