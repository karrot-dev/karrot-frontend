jest.mock('@/store/plugins/i18n')

const mockUsersList = jest.fn()
const mockStoresList = jest.fn()
const mockPickupsList = jest.fn()
const mockGroupsInfoList = jest.fn()
const mockAuthUserGet = jest.fn()
jest.mock('@/services/api/users', () => ({ list: mockUsersList }))
jest.mock('@/services/api/stores', () => ({ list: mockStoresList }))
jest.mock('@/services/api/pickups', () => ({ list: mockPickupsList }))
jest.mock('@/services/api/groupsInfo', () => ({ list: mockGroupsInfoList }))
jest.mock('@/services/api/authUser', () => ({ get: mockAuthUserGet }))

import Vue from 'vue'
import { configureQuasar } from '>/helpers'

describe('storeHelpers', () => {
  beforeEach(() => jest.resetModules())

  it('refreshes some data', () => {
    configureQuasar(Vue)
    const store = require('@/store').default

    mockUsersList.mockReturnValueOnce([])
    mockStoresList.mockReturnValueOnce([])
    mockPickupsList.mockReturnValueOnce({ results: [] })
    mockGroupsInfoList.mockReturnValueOnce([])
    mockAuthUserGet.mockReturnValue({})

    store.dispatch('refresh/refresh')

    expect(mockUsersList).toHaveBeenCalled()
    expect(mockStoresList).toHaveBeenCalled()
    expect(mockPickupsList).toHaveBeenCalled()
    expect(mockGroupsInfoList).toHaveBeenCalled()
    expect(mockAuthUserGet).toHaveBeenCalled()
  })
})
