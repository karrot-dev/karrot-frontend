// Setup a mock router
// See https://github.com/posva/vue-router-mock

import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import {
  VueRouterMock,
  createRouterMock,
  injectRouterMock,
} from 'vue-router-mock'

export const router = createRouterMock()
beforeEach(() => {
  injectRouterMock(router)
})

afterEach(() => {
  // Reset or route params stay between tests
  router.reset()
})

// Add properties to the wrapper
config.plugins.VueWrapper.install(VueRouterMock)

// Expose some parts to the @/router import
const mockRouterPush = router.push
const mockRouterReplace = router.replace

vi.mock('@/router', () => ({
  push: mockRouterPush,
  replace: mockRouterReplace,
}))
