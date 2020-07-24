jest.mock('@/base/datastore/i18nPlugin')

const mockUsersList = jest.fn()
const mockPlacesList = jest.fn()
const mockActivitiesList = jest.fn()
const mockListFeedbackPossible = jest.fn()
const mockGroupsInfoList = jest.fn()
const mockAuthUserGet = jest.fn()
const mockMessagesGet = jest.fn()
const mockMessagesListThread = jest.fn()
const mockListMyThreads = jest.fn()
const mockConversationsList = jest.fn()
const mockStatusFetch = jest.fn()
jest.mock('@/users/api/users', () => ({ list: mockUsersList }))
jest.mock('@/places/api/places', () => ({ list: mockPlacesList }))
jest.mock('@/activities/api/activities', () => ({
  listByGroupId: mockActivitiesList,
  listFeedbackPossible: mockListFeedbackPossible,
}))
jest.mock('@/groupInfo/api/groupsInfo', () => ({ list: mockGroupsInfoList }))
jest.mock('@/authuser/api/authUser', () => ({ get: mockAuthUserGet }))
jest.mock('@/messages/api/messages', () => ({ get: mockMessagesGet, listThread: mockMessagesListThread, listMyThreads: mockListMyThreads }))
jest.mock('@/messages/api/conversations', () => ({ list: mockConversationsList }))
const mockNotificationsList = jest.fn()
jest.mock('@/notifications/api/notifications', () => ({ list: mockNotificationsList }))
const mockFeedbackList = jest.fn()
jest.mock('@/feedback/api/feedback', () => ({ list: mockFeedbackList }))
const mockHistoryList = jest.fn()
jest.mock('@/history/api/history', () => ({ list: mockHistoryList }))

// those are mocked, but we don't care if they have been called or not
jest.mock('@/group/api/groups', () => ({ get: jest.fn(_ => ({})) }))
jest.mock('@/applications/api/applications', () => ({ list: jest.fn(_ => ({ results: [] })) }))
jest.mock('@/communityFeed/api/communityFeed', () => ({
  latestTopics: jest.fn(_ => []),
  getMeta: jest.fn(),
}))
jest.mock('@/invitations/api/invitations', () => ({ listByGroupId: jest.fn(_ => []) }))
jest.mock('@/status/api/status', () => ({ fetch: mockStatusFetch }))

import Vue from 'vue'
import { configureQuasar, nextTicks } from '>/helpers'

describe('refresh', () => {
  beforeEach(() => jest.resetModules())

  it('refreshes some data', async () => {
    configureQuasar(Vue)

    mockUsersList.mockReturnValueOnce([])
    mockPlacesList.mockReturnValueOnce([])
    mockActivitiesList.mockReturnValue({ results: [] })
    mockListFeedbackPossible.mockReturnValue({ results: [] })
    mockGroupsInfoList.mockReturnValueOnce([])
    mockAuthUserGet.mockReturnValue({ id: 1, language: 'en' })
    mockMessagesGet.mockReturnValue({})
    mockMessagesListThread.mockReturnValue({ results: [] })
    mockListMyThreads.mockReturnValue({ results: {} })
    mockConversationsList.mockReturnValue({ results: {} })
    mockNotificationsList.mockReturnValue({ results: {} })
    mockFeedbackList.mockReturnValue({ results: [] })
    mockHistoryList.mockReturnValue({ results: [] })
    mockStatusFetch.mockReturnValue({})

    const datastore = require('@/base/datastore').default
    datastore.commit('currentGroup/setId', 1)
    datastore.commit('currentGroup/set', { id: 1 })
    datastore.commit('currentThread/setScope', 1)
    datastore.commit('auth/setUser', { id: 1 })

    // wait until plugins ran (e.g. latestMessages)
    await nextTicks(4)
    mockListMyThreads.mockClear()
    mockConversationsList.mockClear()
    mockNotificationsList.mockClear()

    await datastore.dispatch('refresh/refresh')

    expect(mockUsersList).toHaveBeenCalled()
    expect(mockPlacesList).toHaveBeenCalled()
    expect(mockActivitiesList).toHaveBeenCalledWith(1)
    expect(mockGroupsInfoList).toHaveBeenCalled()
    expect(mockAuthUserGet).toHaveBeenCalled()
    expect(mockMessagesGet).toHaveBeenCalledWith(1)
    expect(mockMessagesListThread).toHaveBeenCalled()
    expect(mockListMyThreads).toHaveBeenCalled()
    expect(mockConversationsList).toHaveBeenCalled()
    expect(mockNotificationsList).toHaveBeenCalled()
    expect(mockFeedbackList).toHaveBeenCalledWith({ group: 1 })
    expect(mockHistoryList).toHaveBeenCalledWith({ group: 1 })
  })
})
