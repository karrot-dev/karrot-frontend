import Vue from 'vue'
import Vuex from 'vuex'

const mockStatus = jest.fn()
const mockLogin = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('@/base/router', () => ({ push: mockRouterPush }))
jest.mock('@/authuser/api/auth', () => ({ login: mockLogin }))
jest.mock('@/authuser/api/authUser', () => ({ get: mockStatus }))

import { createValidationError, statusMocks } from '>/helpers'
import { withMeta, createMetaModule, defaultFindId, toggles } from '@/utils/datafoo/helpers'

Vue.use(Vuex)

describe('helpers', () => {
  beforeEach(() => jest.resetModules())

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
      expect(store.getters['meta/status']('run', id).pending).toEqual(false)
    })

    it('handles validation errors', async () => {
      const validationErrors = { foo: ['bar'] }
      run.mockImplementationOnce(() => { throw createValidationError(validationErrors) })
      await store.dispatch('run', { id })
      expect(run).toBeCalled()
      expect(store.getters['meta/status']('run', id)).toEqual(statusMocks.validationError('foo', 'bar'))
    })

    it('throws any other errors back atcha', async () => {
      const error = new Error('raaaaaaaaaaa I am an error')
      run.mockImplementationOnce(() => { throw error })
      await expect(store.dispatch('run', { id })).rejects.toBe(error)
      expect(run).toBeCalled()
      expect(store.getters['meta/status']('run', id)).toEqual(statusMocks.default())
    })

    it('goes into pending state during request', async () => {
      const runPromise = store.dispatch('run', { id })
      expect(store.getters['meta/status']('run', id).pending).toEqual(true)
      await runPromise
      expect(store.getters['meta/status']('run', id).pending).toEqual(false)
    })

    it('does not let concurrent actions', async () => {
      const runPromise = store.dispatch('run', { id })
      await expect(store.dispatch('run', { id })).rejects.toHaveProperty('message', `action already pending for run/${id}`)
      await runPromise
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
  })

  describe('toggles', () => {
    let store
    beforeEach(() => {
      store = new Vuex.Store({
        modules: { toggle: toggles({
          something: true,
          notSomething: false,
        }) },
      })
    })
    it('inits toggles', () => {
      expect(store.getters['toggle/something']).toEqual(true)
      expect(store.getters['toggle/notSomething']).toEqual(false)
    })
    it('toggles with action', () => {
      store.dispatch('toggle/something')
      expect(store.getters['toggle/something']).toEqual(false)
      store.dispatch('toggle/notSomething')
      expect(store.getters['toggle/notSomething']).toEqual(true)
    })
    it('forces a value', () => {
      store.dispatch('toggle/something', true)
      expect(store.getters['toggle/something']).toEqual(true)
      store.dispatch('toggle/something', true)
      expect(store.getters['toggle/something']).toEqual(true)
    })
  })
})
