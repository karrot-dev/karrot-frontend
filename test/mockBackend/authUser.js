import { get, patch } from './mockAxios'

import { ctx } from './index'

export function createAuthUserBackend () {
  get('/api/auth/user/', () => [200, ctx.authUser])

  patch(
    '/api/auth/user/',
    ({ data }) => {
      Object.assign(ctx.authUser, data)
      return [200, ctx.authUser]
    },
  )
}
