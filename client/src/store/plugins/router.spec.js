import Vue from 'vue'
import { createStore, throws } from '>/helpers'
import { createRouteError } from '@/store/helpers'
import VueRouter from 'vue-router'
import { maybeDispatchActions } from './router'

jest.mock('@/router')

function makeTestModule () {
  return {
    actions: {
      beforeEnter: jest.fn(),
      afterLeave: jest.fn(),
      beforeEnterChild: jest.fn(),
      afterLeaveChild: jest.fn(),
    },
  }
}

function makeRouteErrorModule () {
  return {
    actions: {
      set: jest.fn(),
    },
  }
}

describe('router plugin / beforeEnter & afterLeave meta options', () => {
  beforeEach(() => jest.resetModules())

  let store, router, test, routeError
  beforeEach(() => {
    test = makeTestModule()
    routeError = makeRouteErrorModule()

    store = createStore(
      {
        routeError,
        test,
      },
    )

    const routes = [
      {
        name: 'route1',
        path: '/route1/:testId',
        meta: {
          beforeEnter: 'test/beforeEnter',
          afterLeave: 'test/afterLeave',
        },
        children: [
          {
            name: 'child',
            path: '/child/:childId',
            meta: {
              beforeEnter: 'test/beforeEnterChild',
              afterLeave: 'test/afterLeaveChild',
            },
          },
        ],
      },
      {
        name: 'route2',
        path: '/route2',
      },
    ]

    router = new VueRouter({ routes })
    router.beforeEach(async (to, from, next) => {
      await maybeDispatchActions(store, to, from)
      next()
    })
  })

  it('triggers beforeEnter action on route enter', async () => {
    router.push({ name: 'route1', params: { testId: '42' } })
    await Vue.nextTick()
    expect(test.actions.beforeEnter.mock.calls.length).toBe(1)
    expect(test.actions.beforeEnter.mock.calls[0][1]).toEqual({ testId: 42 })
    expect(test.actions.afterLeave).not.toBeCalled()
    expect(routeError.actions.set).not.toBeCalled()
  })

  it('triggers afterLeave action on route leave', async () => {
    router.push({ name: 'route1', params: { testId: '42' } })
    await Vue.nextTick()
    router.push({ name: 'route2' })
    await Vue.nextTick()
    expect(test.actions.afterLeave).toBeCalled()
    expect(routeError.actions.set).not.toBeCalled()
  })

  it('sets routeError if beforeEnter throws', async () => {
    test.actions.beforeEnter.mockImplementation(throws(createRouteError('message')))
    router.push({ name: 'route1', params: { testId: '42' } })
    await Vue.nextTick()
    expect(test.actions.beforeEnter).toBeCalled()
    expect(routeError.actions.set).toBeCalled()
    expect(routeError.actions.set.mock.calls[0][1]).toEqual('message')
  })

  it('calls parent enter action first and leave action last', async () => {
    let callOrder = []
    test.actions.beforeEnter.mockImplementationOnce(() => callOrder.push('parentEnter'))
    test.actions.beforeEnterChild.mockImplementationOnce(() => callOrder.push('childEnter'))
    test.actions.afterLeave.mockImplementationOnce(() => callOrder.push('parentLeave'))
    test.actions.afterLeaveChild.mockImplementationOnce(() => callOrder.push('childLeave'))
    router.push({ name: 'child', params: { testId: '42', 'childId': '44' } })
    await Vue.nextTick(); await Vue.nextTick()
    router.push({ name: 'route2' })
    await Vue.nextTick()
    expect(test.actions.beforeEnter.mock.calls[0][1]).toEqual({ testId: 42, childId: 44 })
    expect(test.actions.beforeEnterChild.mock.calls[0][1]).toEqual({ testId: 42, childId: 44 })
    expect(callOrder).toEqual(['parentEnter', 'childEnter', 'childLeave', 'parentLeave'])
  })

  it('dont call child enter action if parent throws', async () => {
    test.actions.beforeEnter.mockImplementation(throws(createRouteError()))
    router.push({ name: 'child', params: { testId: '42', 'childId': '44' } })
    await Vue.nextTick(); await Vue.nextTick()
    expect(routeError.actions.set).toBeCalled()
    expect(test.actions.beforeEnterChild).not.toBeCalled()
  })
})
