const mockTranslate = jest.fn()
jest.mock('@/i18n', () => ({ t: mockTranslate }))

import { createStore } from '>/helpers'

describe('breadcrumbs', () => {
  let storeMocks
  let store

  beforeEach(() => jest.resetModules())
  beforeEach(() => {
    storeMocks = {
      currentGroup: {
        getters: {
          get: () => ({ id: 1, name: 'my current group' }),
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
    store = createStore({
      breadcrumbs: require('./breadcrumbs').default,
      ...storeMocks,
    })
  })

  it('can create an currentGroup item', async () => {
    await store.dispatch('breadcrumbs/setAll', [{ type: 'currentGroup' }])
    expect(store.getters['breadcrumbs/all']).toEqual([{ name: 'my current group', route: { name: 'group', groupId: 1 } }])
  })

  it('can create an activeGroupPreview item', async () => {
    await store.dispatch('breadcrumbs/setAll', [{ type: 'activeGroupPreview' }])
    expect(store.getters['breadcrumbs/all']).toEqual([{ name: 'my current group info', route: { name: 'groupPreview', groupPreviewId: 4 } }])
  })

  it('can create an activeStore item', async () => {
    await store.dispatch('breadcrumbs/setAll', [{ type: 'activeStore' }])
    expect(store.getters['breadcrumbs/all']).toEqual([{ name: 'my active store', route: { name: 'store', storeId: 2 } }])
  })

  it('can create an activeUser item', async () => {
    await store.dispatch('breadcrumbs/setAll', [{ type: 'activeUser' }])
    expect(store.getters['breadcrumbs/all']).toEqual([{ name: 'my active user', route: { name: 'user', userId: 3 } }])
  })

  it('can do translation stuff', async () => {
    mockTranslate.mockReturnValueOnce('translated value')
    await store.dispatch('breadcrumbs/setAll', [{ translation: 'translation.key' }])
    expect(store.getters['breadcrumbs/all']).toEqual([{ name: 'translated value', translation: 'translation.key' }])
  })
})
