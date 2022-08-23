import { get } from './mockAxios'

import { ctx } from './index'

export function createAuthUserBackend () {
  get('/api/auth/user/', () => [200, ctx.authUser])
}
