import { get } from '>/mockBackend/mockAxios'

export function createMockCommunityBackend () {
  get('/api/community-feed/', () => [200, { markedAt: null }])

  // TODO: do _something_ here (e.g. so we can show banner)
  get('/community_proxy/t/:id.json', () => [200, {
    postStream: {
      posts: [],
    },
  }], {
    requireAuth: false,
  })

  get('/community_proxy/c/:name/:id.json', () => [200, {
    topicList: {
      topics: [],
    },
  }], {
    requireAuth: false,
  })
}
