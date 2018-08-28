jest.mock('@/store/plugins/i18n')

const mockUsersList = jest.fn()
const mockStoresList = jest.fn()
const mockPickupsList = jest.fn()
const mockGroupsInfoList = jest.fn()
const mockAuthUserGet = jest.fn()
const mockMessagesGet = jest.fn()
const mockMessagesListThread = jest.fn()
const mockListMyThreads = jest.fn()
const mockConversationsList = jest.fn()
jest.mock('@/services/api/users', () => ({ list: mockUsersList }))
jest.mock('@/services/api/stores', () => ({ list: mockStoresList }))
jest.mock('@/services/api/pickups', () => ({ listByGroupId: mockPickupsList }))
jest.mock('@/services/api/groupsInfo', () => ({ list: mockGroupsInfoList }))
jest.mock('@/services/api/authUser', () => ({ get: mockAuthUserGet }))
jest.mock('@/services/api/messages', () => ({ get: mockMessagesGet, listThread: mockMessagesListThread, listMyThreads: mockListMyThreads }))
jest.mock('@/services/api/conversations', () => ({ list: mockConversationsList }))

import Vue from 'vue'
import { configureQuasar } from '>/helpers'

describe('storeHelpers', () => {
  beforeEach(() => jest.resetModules())

  it('refreshes some data', () => {
    configureQuasar(Vue)
    const store = require('@/store').default
    store.commit('currentGroup/set', { id: 1 })
    store.commit('currentThread/setScope', 1)

    mockUsersList.mockReturnValueOnce([])
    mockStoresList.mockReturnValueOnce([])
    mockPickupsList.mockReturnValueOnce({ results: [] })
    mockGroupsInfoList.mockReturnValueOnce([])
    mockAuthUserGet.mockReturnValue({})
    mockMessagesGet.mockReturnValue({})
    mockMessagesListThread.mockReturnValue({ results: [] })
    mockListMyThreads.mockReturnValue({ results: {} })
    mockConversationsList.mockReturnValue({ results: {} })

    store.dispatch('refresh/refresh')

    expect(mockUsersList).toHaveBeenCalled()
    expect(mockStoresList).toHaveBeenCalled()
    expect(mockPickupsList).toHaveBeenCalledWith(1)
    expect(mockGroupsInfoList).toHaveBeenCalled()
    expect(mockAuthUserGet).toHaveBeenCalled()
    expect(mockMessagesGet).toHaveBeenCalledWith(1)
    expect(mockMessagesListThread).toHaveBeenCalled()
    expect(mockListMyThreads).toHaveBeenCalled()
    expect(mockConversationsList).toHaveBeenCalled()
  })
})
