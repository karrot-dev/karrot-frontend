const mockFetchGroups = jest.fn()
jest.mock('@/services/api/groups', () => ({ list: mockFetchGroups }))

import { createStore } from '>/helpers'

describe('groups', () => {
  let store

  beforeEach(() => jest.resetModules())
  beforeEach(() => (store = createStore({ groups: require('./groups') })))

  it('can fetch the group list', async () => {
    mockFetchGroups.mockReturnValueOnce([{ id: 1, name: 'group name' }])
    await store.dispatch('groups/fetchGroups')
    expect(store.getters['groups/list']).toEqual([{ id: 1, name: 'group name', isMember: false }])
  })
})
