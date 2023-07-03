// Setup a mock router
// See https://github.com/posva/vue-router-mock

import { config } from '@vue/test-utils'
import { vi, beforeAll } from 'vitest'
import {
  VueRouterMock,
  createRouterMock,
  injectRouterMock,
} from 'vue-router-mock'

let mockRouter
beforeEach(() => {
  mockRouter = createRouterMock()
  injectRouterMock(mockRouter)
})

afterEach(() => {
  // Reset or route params stay between tests
  mockRouter.reset()
  mockRouter = null
})

// Add properties to the wrapper
config.plugins.VueWrapper.install(VueRouterMock)

function mockRouterPush () {
  return mockRouter.push.apply(mockRouter, arguments)
}

function mockRouterReplace () {
  return mockRouter.replace.apply(mockRouter, arguments)
}

// Expose some parts to the @/router import
vi.mock('@/router', () => ({
  push: mockRouterPush,
  replace: mockRouterReplace,
}))
