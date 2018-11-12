const mockTranslate = jest.fn()
jest.mock('@/base/i18n', () => ({ t: mockTranslate }))

import { createDatastore } from '>/helpers'

describe('breadcrumbs', () => {
  let storeMocks
  let datastore

  beforeEach(() => jest.resetModules())
  beforeEach(() => {
    storeMocks = {
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
      stores: {
        getters: {
          activeStore: () => ({ id: 2, name: 'my active store' }),
        },
      },
      users: {
        getters: {
          activeUser: () => ({ id: 3, displayName: 'my active user' }),
        },
      },
    }
    datastore = createDatastore({
      breadcrumbs: require('./breadcrumbs').default,
      ...storeMocks,
    })
  })

  it('can create an currentGroup item', async () => {
    await datastore.commit('breadcrumbs/set', [{ type: 'currentGroup' }])
    expect(datastore.getters['breadcrumbs/all']).toEqual([{ name: 'my current group', route: { name: 'group', groupId: 1 } }])
  })

  it('can create an activeGroupPreview item', async () => {
    await datastore.commit('breadcrumbs/set', [{ type: 'activeGroupPreview' }])
    expect(datastore.getters['breadcrumbs/all']).toEqual([{ name: 'my current group info', route: { name: 'groupPreview', groupPreviewId: 4 } }])
  })

  it('can create an activeStore item', async () => {
    await datastore.commit('breadcrumbs/set', [{ type: 'activeStore' }])
    expect(datastore.getters['breadcrumbs/all']).toEqual([{ name: 'my active store', route: { name: 'store', storeId: 2 } }])
  })

  it('can create an activeUser item', async () => {
    await datastore.commit('breadcrumbs/set', [{ type: 'activeUser' }])
    expect(datastore.getters['breadcrumbs/all']).toEqual([{ name: 'my active user', route: { name: 'user', userId: 3 } }])
  })

  it('can do translation stuff', async () => {
    mockTranslate.mockReturnValueOnce('translated value')
    await datastore.commit('breadcrumbs/set', [{ translation: 'translation.key' }])
    expect(datastore.getters['breadcrumbs/all']).toEqual([{ name: 'translated value', translation: 'translation.key' }])
  })
})
