import { createStore } from '>/helpers'
import { feedbackMock } from '>/mockdata'

const mockPickupGet = jest.fn()
const mockUsersGet = jest.fn()

const pickups = {
  getters: {
    get: () => mockPickupGet,
  },
  actions: {
    maybeFetch: jest.fn(),
  },
}

const currentGroup = {
  getters: {
    id: jest.fn(),
  },
}

const auth = {
  getters: {
    userId: jest.fn(),
  },
}

const users = {
  getters: {
    get: () => mockUsersGet,
  },
}

describe('feedback module', () => {
  beforeEach(() => jest.resetModules())
  let store
  const feedback1 = feedbackMock[0]
  const feedback2 = feedbackMock[1]
  const feedback3 = feedbackMock[2]

  beforeEach(() => {
    store = createStore({
      feedback: require('./feedback').default,
      pickups,
      currentGroup,
      auth,
      users,
    })
  })

  beforeEach(() => {
    store.commit('feedback/update', [feedback1, feedback2, feedback3])
  })

  it('can update feedback', async () => {
    const changed = { ...feedback1, comment: 'new comment' }
    const groupId = 1
    const userId = 1
    mockPickupGet.mockReturnValueOnce({ store: { group: { id: groupId } } })
    currentGroup.getters.id.mockReturnValueOnce(groupId)
    auth.getters.userId.mockReturnValueOnce(userId)

    store.commit('feedback/setScope', { type: 'group', id: groupId })
    await store.dispatch('feedback/update', changed)
    expect(store.getters['feedback/get'](changed.id).comment).toEqual(changed.comment)
  })
})
