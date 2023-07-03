import { get, patch, put, cursorPaginated } from './mockAxios'

import { ctx } from './index'

export function createMockAuthUserBackend () {
  get('/api/auth/user/', () => [200, ctx.authUser])

  cursorPaginated('/api/auth/user/failed_email_deliveries/', () => [
    // TODO mock properly
    {
      createdAt: new Date(),
      address: 'foo@foo.com',
      event: 'failed',
      reason: '',
      subject: '[dev.karrot.world] 📊 02_testgroup: welcome! updates for the week of Sunday, July 24, 2022',
    },
  ])

  patch(
    '/api/auth/user/',
    ({ data }) => {
      Object.assign(ctx.authUser, data)
      return [200, ctx.authUser]
    },
  )

  put('/api/auth/email/', ({ data }) => {
    if (!data.password) return [400, { password: 'Wrong password' }]
    ctx.authUser.unverifiedEmail = data.newEmail
    return [200, {}]
  })

  put('/api/auth/password/', () => {
    // what else could we do here?
    return [200, {}]
  })
}
