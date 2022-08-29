import { get } from './mockAxios'

export function createMockStatusBackend () {
  get('/api/status/', () => [200, {
    unseenConversationCount: 0,
    unseenThreadCount: 0,
    hasUnreadConversationsOrThreads: false,
    unseenNotificationCount: 0,
    groups: {},
    places: {},
  }])
}
