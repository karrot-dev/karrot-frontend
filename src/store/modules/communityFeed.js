import communityFeedAPI from '@/services/api/communityFeed'

function initialState () {
  return {
    topics: [],
    lastSeenId: 0,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    topics: state => state.topics.map(topic => ({
      ...topic,
      isUnread: topic.id > state.lastSeenId,
    })),
    unreadCount: state => state.topics.filter(topic => topic.id > state.lastSeenId).length,
  },
  actions: {
    async fetchTopics ({ commit }) {
      commit('setTopics', await communityFeedAPI.latestTopics())
    },
    mark ({ commit }) {
      commit('mark')
    },
  },
  mutations: {
    setTopics (state, topics) {
      state.topics = topics
    },
    mark (state) {
      state.lastSeenId = state.topics[0].id
    },
  },
}
