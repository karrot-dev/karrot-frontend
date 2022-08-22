import { createBackend } from './mockAxios'

import { ctx } from './index'

export function createAuthUserBackend () {
  createBackend('/api/auth/user/', () => ctx.authUser, { requireAuth: false })
}
