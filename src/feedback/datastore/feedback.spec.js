import { createDatastore } from '>/helpers'
import { feedbackMock } from '>/mockdata'

const mockActivityGet = jest.fn()
const mockUsersGet = jest.fn()

const activities = {
  getters: {
    get: () => mockActivityGet,
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
  let datastore
  const feedback1 = feedbackMock[0]
  const feedback2 = feedbackMock[1]
  const feedback3 = feedbackMock[2]

  beforeEach(() => {
    datastore = createDatastore({
      feedback: require('./feedback').default,
      activities,
      users,
    })
  })

  beforeEach(() => {
    datastore.commit('feedback/update', [feedback1, feedback2, feedback3])
  })

  it('can update feedback', async () => {
    const changed = { ...feedback1, comment: 'new comment' }
    const groupId = feedback1.about.group.id
    const userId = 1
    mockActivityGet.mockReturnValueOnce({ group: { id: groupId } })
    currentGroup.getters.id.mockReturnValueOnce(groupId)
    auth.getters.userId.mockReturnValueOnce(userId)

    await datastore.dispatch('feedback/updateOne', changed)
    expect(datastore.getters['feedback/get'](changed.id).comment).toEqual(changed.comment)
  })
})
