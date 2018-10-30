import { createStore } from '>/helpers'

describe('history module', () => {
  beforeEach(() => jest.resetModules())
  let store

  beforeEach(() => {
    store = createStore({
      invitations: require('./invitations').default,
      users: { getters: { get: () => a => a } },
    })
  })

  it('can add invitation', () => {
    const entry = { id: 1 }

    store.commit('invitations/update', [entry])
    expect(store.getters['invitations/list'][0].id).toEqual(entry.id)
  })

  it('can delete invitation', () => {
    const entry = { id: 1 }
    store.commit('invitations/update', [entry])
    store.commit('invitations/delete', entry.id)
    expect(store.getters['invitations/list'].length).toEqual(0)
  })

  it('keeps entries sorted by creation date', () => {
    const e1 = { id: 1, createdAt: new Date('2018-01-10') }
    const e2 = { id: 2, createdAt: new Date('2018-01-05') }
    const e3 = { id: 3, createdAt: new Date('2018-01-15') }
    store.commit('invitations/update', [e1])
    store.commit('invitations/update', [e2])
    store.commit('invitations/update', [e3])
    expect(store.getters['invitations/list'].length).toEqual(3)
    expect(store.getters['invitations/list'].map(e => e.id)).toEqual([3, 1, 2])
  })
})
