import MockAdapter from 'axios-mock-adapter'
import axios from '@/services/axios'
import groups from '@/services/api/groups'

describe('services/api/groups', () => {
  let mock
  beforeEach(() => {
    mock = new MockAdapter(axios)
  })
  it('should be able to list groups', () => {
    mock.onGet('/api/groups/').reply(200, [{ id: 1 }, { id: 2 }])
    return groups.list().then(groups => {
      expect(groups.length).toBe(2)
    })
  })
})
