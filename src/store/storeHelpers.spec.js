const mockUsersList = jest.fn()
const mockStoresList = jest.fn()
const mockPickupsList = jest.fn()
const mockGroupsInfoList = jest.fn()
jest.mock('@/services/api/users', () => ({ list: mockUsersList }))
jest.mock('@/services/api/stores', () => ({ list: mockStoresList }))
jest.mock('@/services/api/pickups', () => ({ list: mockPickupsList }))
jest.mock('@/services/api/groupsInfo', () => ({ list: mockGroupsInfoList }))

describe('storeHelpers', () => {
  beforeEach(() => jest.resetModules())

  it('refreshes some data', () => {
    mockUsersList.mockReturnValueOnce([])
    mockStoresList.mockReturnValueOnce([])
    mockPickupsList.mockReturnValueOnce({ results: [] })
    mockGroupsInfoList.mockReturnValueOnce([])

    require('@/store/storeHelpers').refresh()

    expect(mockUsersList).toHaveBeenCalled()
    expect(mockStoresList).toHaveBeenCalled()
    expect(mockPickupsList).toHaveBeenCalled()
    expect(mockGroupsInfoList).toHaveBeenCalled()
  })
})
