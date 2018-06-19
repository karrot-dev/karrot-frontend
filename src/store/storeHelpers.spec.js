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

describe('storeHelpers', () => {
  beforeEach(() => jest.resetModules())

  it('refreshes some data', () => {
    mockUsersList.mockReturnValueOnce([])
    mockStoresList.mockReturnValueOnce([])
    mockPickupsList.mockReturnValueOnce({ results: [] })
    mockGroupsInfoList.mockReturnValueOnce([])
    mockAuthUserGet.mockReturnValue({})

    require('@/store/storeHelpers').refresh()

    expect(mockUsersList).toHaveBeenCalled()
    expect(mockStoresList).toHaveBeenCalled()
    expect(mockPickupsList).toHaveBeenCalled()
    expect(mockGroupsInfoList).toHaveBeenCalled()
    expect(mockAuthUserGet).toHaveBeenCalled()
  })
})
