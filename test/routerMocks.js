// Setup a mock router
// See https://github.com/posva/vue-router-mock

const { config } = require('@vue/test-utils')

const {
  VueRouterMock,
  createRouterMock,
  injectRouterMock,
} = require('vue-router-mock')

export const router = createRouterMock()
beforeEach(() => {
  injectRouterMock(router)
})

// Add properties to the wrapper
config.plugins.VueWrapper.install(VueRouterMock)

// Expose some parts to the @/router import
const mockRouterPush = router.push
const mockRouterReplace = router.replace

jest.mock('@/router', () => ({
  push: mockRouterPush,
  replace: mockRouterReplace,
}))
