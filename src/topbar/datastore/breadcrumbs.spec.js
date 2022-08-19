import { createDatastore } from '>/helpers'

const mockTranslate = jest.fn()
jest.mock('@/base/i18n', () => ({ t: mockTranslate }))

describe('breadcrumbs', () => {
  let datastoreMocks
  let datastore

  beforeEach(() => jest.resetModules())
  beforeEach(() => {
    datastoreMocks = {
      currentGroup: {
        getters: {
          value: () => ({ id: 1, name: 'my current group' }),
        },
      },
      groups: {
        getters: {
          activePreview: () => ({ id: 4, name: 'my current group info' }),
        },
      },
      places: {
        getters: {
          activePlace: () => ({ id: 2, name: 'my active place', group: { id: 3 } }),
        },
      },
      users: {
        getters: {
          activeUser: () => ({ id: 3, displayName: 'my active user' }),
        },
      },
    }
    datastore = createDatastore(datastoreMocks)
  })

  it('can create an currentGroup item', async () => {
    await datastore.commit('breadcrumbs/set', [{ type: 'currentGroup' }])
    expect(datastore.getters['breadcrumbs/all']).toEqual([{ name: 'my current group', route: { name: 'group', params: { groupId: 1 } } }])
  })

  it('can create an activeGroupPreview item', async () => {
    await datastore.commit('breadcrumbs/set', [{ type: 'activeGroupPreview' }])
    expect(datastore.getters['breadcrumbs/all']).toEqual([{ name: 'my current group info', route: { name: 'groupPreview', params: { groupPreviewId: 4 } } }])
  })

  it('can create an activePlace item', async () => {
    await datastore.commit('breadcrumbs/set', [{ type: 'activePlace' }])
    expect(datastore.getters['breadcrumbs/all']).toEqual([{ name: 'my active place', route: { name: 'place', params: { placeId: 2, groupId: 3 } } }])
  })

  it('can create an activeUser item', async () => {
    await datastore.commit('breadcrumbs/set', [{ type: 'activeUser' }])
    expect(datastore.getters['breadcrumbs/all']).toEqual([{ name: 'my active user', route: { name: 'user', params: { userId: 3 } } }])
  })

  it('can do translation stuff', async () => {
    mockTranslate.mockReturnValueOnce('translated value')
    await datastore.commit('breadcrumbs/set', [{ translation: 'translation.key' }])
    expect(datastore.getters['breadcrumbs/all']).toEqual([{ name: 'translated value', translation: 'translation.key' }])
  })
})
