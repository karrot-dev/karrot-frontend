import Vue from 'vue'
import Vuex from 'vuex'

const mockStatus = jest.fn()
const mockLogin = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('@/router', () => ({ push: mockRouterPush }))
jest.mock('@/services/api/auth', () => ({ login: mockLogin }))
jest.mock('@/services/api/authUser', () => ({ get: mockStatus }))

import { createValidationError } from '>/helpers'
import { withMeta, createMetaModule } from '@/store/helpers'

Vue.use(Vuex)

describe('helpers', () => {
  describe('createMetaModule', () => {
    const id = 'foo'
    let run
    let meta
    let store
    beforeEach(() => {
      run = jest.fn()
      meta = createMetaModule()
      store = new Vuex.Store({
        modules: { meta },
        actions: withMeta({
          run,
        }),
      })
    })

    it('is a function', () => {
      expect(typeof createMetaModule).toBe('function')
    })

    it('calls run', async () => {
      await store.dispatch('run', { id })
      expect(run).toBeCalled()
      expect(store.getters['meta/byId'](id)).toEqual({})
    })

    it('handles validation errors', async () => {
      const validationErrors = { foo: 'bar' }
      run.mockImplementationOnce(() => { throw createValidationError(validationErrors) })
      await store.dispatch('run', { id })
      expect(run).toBeCalled()
      expect(store.getters['meta/byId'](id)).toEqual({
        run: {
          validationErrors,
        },
      })
    })

    it('throws any other errors back atcha', async () => {
      const error = new Error('raaaaaaaaaaa I am an error')
      run.mockImplementationOnce(() => { throw error })
      await expect(store.dispatch('run', { id })).rejects.toBe(error)
      expect(run).toBeCalled()
      expect(store.getters['meta/byId'](id)).toEqual({})
    })

    it('goes into pending state during request', async () => {
      const promise = new Promise(resolve => {
        store.dispatch('run', { id })
        expect(store.getters['meta/byId'](id)).toEqual({
          run: {
            pending: true,
          },
        })
        resolve()
      })
      run.mockReturnValueOnce(promise)
      await promise
    })
  })
})
