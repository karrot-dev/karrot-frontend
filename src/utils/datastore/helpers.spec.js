import Vue from 'vue'
import Vuex from 'vuex'

const mockStatus = jest.fn()
const mockLogin = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('@/base/router', () => ({ push: mockRouterPush }))
jest.mock('@/authuser/api/auth', () => ({ login: mockLogin }))
jest.mock('@/authuser/api/authUser', () => ({ get: mockStatus }))

import { createValidationError, statusMocks } from '>/helpers'
import { withMeta, createMetaModule, defaultFindId, toggles } from '@/utils/datastore/helpers'

Vue.use(Vuex)

describe('helpers', () => {
  beforeEach(() => jest.resetModules())

  describe('createMetaModule', () => {
    const id = 'foo'
    let run
    let meta
    let datastore
    beforeEach(() => {
      run = jest.fn()
      meta = createMetaModule()
      datastore = new Vuex.Store({
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
      await datastore.dispatch('run', { id })
      expect(run).toBeCalled()
      expect(datastore.getters['meta/status']('run', id).pending).toEqual(false)
    })

    it('handles validation errors', async () => {
      const validationErrors = { foo: ['bar'] }
      run.mockImplementationOnce(() => { throw createValidationError(validationErrors) })
      await datastore.dispatch('run', { id })
      expect(run).toBeCalled()
      expect(datastore.getters['meta/status']('run', id)).toEqual(statusMocks.validationError('foo', 'bar'))
    })

    it('throws any other errors back atcha', async () => {
      const error = new Error('raaaaaaaaaaa I am an error')
      run.mockImplementationOnce(() => { throw error })
      await expect(datastore.dispatch('run', { id })).rejects.toBe(error)
      expect(run).toBeCalled()
      expect(datastore.getters['meta/status']('run', id)).toEqual(statusMocks.default())
    })

    it('goes into pending state during request', async () => {
      const runPromise = datastore.dispatch('run', { id })
      expect(datastore.getters['meta/status']('run', id).pending).toEqual(true)
      await runPromise
      expect(datastore.getters['meta/status']('run', id).pending).toEqual(false)
    })
  })

  describe('defaultFindId', () => {
    it('returns undefined on fals-y input', () => {
      expect(defaultFindId(null)).toBeUndefined()
      expect(defaultFindId(undefined)).toBeUndefined()
      expect(defaultFindId({})).toBeUndefined()
      expect(defaultFindId([])).toBeUndefined()
    })
    it('finds id in object', () => {
      expect(defaultFindId({ id: 5 })).toBe(5)
    })

    it('passes number unchanged', () => {
      expect(defaultFindId(5)).toBe(5)
    })

    it('passes strings unchanged, does not warn if it is a real string', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {})
      expect(defaultFindId('hello')).toBe('hello')
      expect(console.warn).not.toHaveBeenCalled()
      console.warn.mockRestore()
    })

    it('passes strings unchanged, warns if they are numbers', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {})
      expect(defaultFindId('5')).toBe('5')
      expect(console.warn).toHaveBeenCalledWith('findId: number passed as string', '5')
      console.warn.mockRestore()
    })
  })

  describe('toggles', () => {
    let datastore
    beforeEach(() => {
      datastore = new Vuex.Store({
        modules: { toggle: toggles({
          something: true,
          notSomething: false,
        }) },
      })
    })
    it('inits toggles', () => {
      expect(datastore.getters['toggle/something']).toEqual(true)
      expect(datastore.getters['toggle/notSomething']).toEqual(false)
    })
    it('toggles with action', () => {
      datastore.dispatch('toggle/something')
      expect(datastore.getters['toggle/something']).toEqual(false)
      datastore.dispatch('toggle/notSomething')
      expect(datastore.getters['toggle/notSomething']).toEqual(true)
    })
    it('forces a value', () => {
      datastore.dispatch('toggle/something', true)
      expect(datastore.getters['toggle/something']).toEqual(true)
      datastore.dispatch('toggle/something', true)
      expect(datastore.getters['toggle/something']).toEqual(true)
    })
  })
})
