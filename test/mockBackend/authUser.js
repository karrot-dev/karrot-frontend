import { createBackend } from './mockAxios'

import { ctx } from './index'

export function createAuthUserBackend () {
  createBackend('get', '/api/auth/user/', () => ctx.authUser)
}
