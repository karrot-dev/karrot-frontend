const mockGet = jest.fn()
jest.mock('@/utils/api/about', () => ({ get: mockGet }))

import { createDatastore, throws } from '>/helpers'

describe('spec', () => {
  let datastore

  beforeEach(() => jest.resetModules())
  beforeEach(() => (datastore = createDatastore({ about: require('./about').default })))

  it('sets all the about values', async () => {
    mockGet.mockReturnValueOnce({ name: 'peter' })
    await datastore.dispatch('about/fetch')
    expect(datastore.getters['about/deployed']).toEqual({
      name: 'peter',
    })
  })

  it('ignores the error', async () => {
    mockGet.mockImplementation(throws('some error'))
    await datastore.dispatch('about/fetch')
    expect(datastore.getters['about/deployed']).toBeNull()
  })
})
