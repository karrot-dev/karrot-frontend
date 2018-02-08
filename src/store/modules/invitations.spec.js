import { createStore } from '>/helpers'

describe('history module', () => {
  let store

  beforeEach(() => {
    store = createStore({
      invitations: require('./invitations').default,
      users: { getters: { get: () => a => a } },
    })
  })

  it('can add invitation', () => {
    const entry = { id: 1 }

    store.dispatch('invitations/add', entry)
    expect(store.getters['invitations/list'][0].id).toEqual(entry.id)
  })

  it('can delete invitation', () => {
    const entry = { id: 1 }
    store.dispatch('invitations/add', entry)
    store.dispatch('invitations/delete', entry.id)
    expect(store.getters['invitations/list'].length).toEqual(0)
  })

  it('keeps entries sorted by creation date', () => {
    const e1 = { id: 1, createdAt: new Date('2018-01-10') }
    const e2 = { id: 2, createdAt: new Date('2018-01-05') }
    const e3 = { id: 3, createdAt: new Date('2018-01-15') }
    store.dispatch('invitations/add', e1)
    store.dispatch('invitations/add', e2)
    store.dispatch('invitations/add', e3)
    expect(store.getters['invitations/list'].length).toEqual(3)
    expect(store.getters['invitations/list'].map(e => e.id)).toEqual([3, 1, 2])
  })
})
