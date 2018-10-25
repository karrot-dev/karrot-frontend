jest.mock('@/base/datafoo/i18nPlugin')

const mockUsersList = jest.fn()
const mockStoresList = jest.fn()
const mockPickupsList = jest.fn()
const mockGroupsInfoList = jest.fn()
const mockAuthUserGet = jest.fn()
const mockMessagesGet = jest.fn()
const mockMessagesListThread = jest.fn()
const mockListMyThreads = jest.fn()
const mockConversationsList = jest.fn()
jest.mock('@/users/api/users', () => ({ list: mockUsersList }))
jest.mock('@/stores/api/stores', () => ({ list: mockStoresList }))
jest.mock('@/pickups/api/pickups', () => ({ listByGroupId: mockPickupsList }))
jest.mock('@/groupInfo/api/groupsInfo', () => ({ list: mockGroupsInfoList }))
jest.mock('@/authuser/api/authUser', () => ({ get: mockAuthUserGet }))
jest.mock('@/messages/api/messages', () => ({ get: mockMessagesGet, listThread: mockMessagesListThread, listMyThreads: mockListMyThreads }))
jest.mock('@/messages/api/conversations', () => ({ list: mockConversationsList }))
const mockNotificationsList = jest.fn()
jest.mock('@/notifications/api/notifications', () => ({ list: mockNotificationsList }))

import Vue from 'vue'
import { configureQuasar, nextTicks } from '>/helpers'

describe('storeHelpers', () => {
  beforeEach(() => jest.resetModules())

  it('refreshes some data', async () => {
    configureQuasar(Vue)

    mockUsersList.mockReturnValueOnce([])
    mockStoresList.mockReturnValueOnce([])
    mockPickupsList.mockReturnValueOnce({ results: [] })
    mockGroupsInfoList.mockReturnValueOnce([])
    mockAuthUserGet.mockReturnValue({ id: 1, language: 'en' })
    mockMessagesGet.mockReturnValue({})
    mockMessagesListThread.mockReturnValue({ results: [] })
    mockListMyThreads.mockReturnValue({ results: {} })
    mockConversationsList.mockReturnValue({ results: {} })
    mockNotificationsList.mockReturnValue({ results: {} })

    const store = require('@/base/store').default
    store.commit('currentGroup/set', { id: 1 })
    store.commit('currentThread/setScope', 1)
    store.commit('auth/setUser', { id: 1 })

    // wait until plugins ran (e.g. latestMessages)
    await nextTicks(2)
    mockListMyThreads.mockClear()
    mockConversationsList.mockClear()
    mockNotificationsList.mockClear()

    await store.dispatch('refresh/refresh')

    expect(mockUsersList).toHaveBeenCalled()
    expect(mockStoresList).toHaveBeenCalled()
    expect(mockPickupsList).toHaveBeenCalledWith(1)
    expect(mockGroupsInfoList).toHaveBeenCalled()
    expect(mockAuthUserGet).toHaveBeenCalled()
    expect(mockMessagesGet).toHaveBeenCalledWith(1)
    expect(mockMessagesListThread).toHaveBeenCalled()
    expect(mockListMyThreads).toHaveBeenCalled()
    expect(mockConversationsList).toHaveBeenCalled()
    expect(mockNotificationsList).toHaveBeenCalled()
  })
})
