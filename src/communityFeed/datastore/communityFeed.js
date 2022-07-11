// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import communityFeedAPI from '@/communityFeed/api/communityFeed'

const COMMUNITY_BANNER_TOPIC_ID = process.env.KARROT.BACKEND === 'https://karrot.world' ? 933 : 930

function initialState () {
  return {
    topics: [],
    banner: null,
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
    banner: state => state.banner,
    unreadCount: (state, getters) => getters.topics.filter(t => t.isUnread).length,
  },
  actions: {
    async fetchTopics ({ commit }) {
      commit('setTopics', await communityFeedAPI.latestTopics())
    },
    async fetchBanner ({ commit }) {
      const topic = await communityFeedAPI.getTopic(COMMUNITY_BANNER_TOPIC_ID)
      const { posts } = topic.postStream
      posts.shift() // remove the first one, the first post in the topic is not an announcement
      if (posts.length > 0) {
        const post = posts[posts.length - 1]
        const id = getDismissedBannerId()
        if (!id || (post.id > id)) { // assuming post ids always increment...
          commit('setBanner', { id: post.id, html: post.cooked })
        }
      }
    },
    async fetchMeta ({ commit }) {
      commit('setMeta', await communityFeedAPI.getMeta())
    },
    mark ({ rootGetters }) {
      if (!rootGetters['auth/isLoggedIn']) return
      communityFeedAPI.markSeen()
    },
    dismissBanner ({ commit }, id) {
      dismissBanner(id)
      commit('setBanner', null)
    },
  },
  mutations: {
    setTopics (state, topics) {
      state.topics = topics
    },
    setBanner (state, banner) {
      state.banner = banner
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

function dismissBanner (id) {
  if (window.localStorage) {
    window.localStorage.setItem('dismissedBanner', JSON.stringify({ id }))
  }
}

function getDismissedBannerId () {
  if (window.localStorage) {
    const item = window.localStorage.getItem('dismissedBanner')
    if (item) {
      return JSON.parse(item).id
    }
    return null
  }
}
