import Vue from 'vue'
import Vuex from 'vuex'

const mockStatus = jest.fn()
const mockLogin = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('@/router', () => ({ push: mockRouterPush }))
jest.mock('@/services/api/auth', () => ({ login: mockLogin }))
jest.mock('@/services/api/authUser', () => ({ get: mockStatus }))

import { defineRequestModule } from '@/store/helpers'

Vue.use(Vuex)

describe('helpers', () => {
  describe('defineRequestModule', () => {
    const id = 'foo'
    let run
    let onValidationError
    let meta
    let store
    beforeEach(() => {
      meta = defineRequestModule()
      store = new Vuex.Store({ modules: { meta } })
      run = jest.fn()
      onValidationError = jest.fn()
    })

    it('is a function', () => {
      expect(typeof defineRequestModule).toBe('function')
    })

    it('calls run', async () => {
      await store.dispatch('meta/request', { id, run })
      expect(run).toBeCalled()
    })

    it('handles validation errors', async () => {
      const data = { foo: 'bar' }
      const error = createValidationError(data)
      run.mockImplementationOnce(() => { throw error })
      await store.dispatch('meta/request', { id, run, onValidationError })
      expect(run).toBeCalled()
      expect(onValidationError).toBeCalledWith(error)
      expect(store.getters['meta/get'](id)).toEqual({
        error: data,
        isWaiting: false,
        success: false,
      })
    })

    it('handles request errors', async () => {
      run.mockImplementationOnce(() => { throw createRequestError() })
      await store.dispatch('meta/request', { id, run, onValidationError })
      expect(run).toBeCalled()
      expect(onValidationError).not.toBeCalled()
      expect(store.getters['meta/get'](id)).toEqual({
        isWaiting: false,
        success: false,
      })
    })

    it('throws any other errors back atcha', async () => {
      const error = new Error('raaaaaaaaaaa I am an error')
      run.mockImplementationOnce(() => { throw error })
      await expect(store.dispatch('meta/request', { id, run, onValidationError })).rejects.toBe(error)
      expect(run).toBeCalled()
      expect(onValidationError).not.toBeCalled()
      expect(store.getters['meta/get'](id)).toEqual({
        isWaiting: false,
        success: false,
      })
    })
  })
})

function createValidationError (data) {
  return Object.assign(new Error(), {
    response: {
      status: 403,
      data,
    },
  })
}

function createRequestError () {
  return Object.assign(new Error(), {
    response: {
      status: 500,
      request: 'foo',
    },
  })
}
