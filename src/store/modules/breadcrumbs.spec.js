const mockTranslate = jest.fn()
jest.mock('@/i18n', () => ({ t: mockTranslate }))

import { createStore } from '>/helpers'

describe('breadcrumbs', () => {
  let store

  beforeEach(() => jest.resetModules())
  beforeEach(() => (store = createStore({ breadcrumbs: require('./breadcrumbs') }, {
    'groups/activeGroup': () => ({ id: 1, name: 'my active group' }),
    'groups/activeGroupInfo': () => ({ id: 4, name: 'my active group info' }),
    'stores/activeStore': () => ({ id: 2, name: 'my active store' }),
    'users/activeUser': () => ({ id: 3, displayName: 'my active user' }),
  })))

  it('can create an activeGroup item', async () => {
    await store.dispatch('breadcrumbs/setAll', [{ type: 'activeGroup' }])
    expect(store.getters['breadcrumbs/all']).toEqual([{ name: 'my active group', route: { name: 'group', groupId: 1 } }])
  })

  it('can create an activeGroupInfo item', async () => {
    await store.dispatch('breadcrumbs/setAll', [{ type: 'activeGroupInfo' }])
    expect(store.getters['breadcrumbs/all']).toEqual([{ name: 'my active group info', route: { name: 'groupInfo', groupInfoId: 4 } }])
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
