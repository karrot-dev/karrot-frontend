const mockGet = jest.fn()
jest.mock('@/services/api/about', () => ({ get: mockGet }))

import { createStore, throws } from '>/helpers'

describe('spec', () => {
  let store

  beforeEach(() => jest.resetModules())
  beforeEach(() => (store = createStore({ about: require('./about') })))

  it('sets all the about values', async () => {
    mockGet.mockReturnValueOnce({ name: 'peter' })
    await store.dispatch('about/fetchAbout')
    expect(store.getters['about/get']).toEqual({
      error: null,
      name: 'peter',
    })
  })

  it('sets the error', async () => {
    mockGet.mockImplementation(throws('some error'))
    await store.dispatch('about/fetchAbout')
    expect(store.getters['about/get']).toEqual({ error: 'some error' })
  })
})
