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
})
