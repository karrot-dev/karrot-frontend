import { faker } from '@faker-js/faker'

import { addUserToGroup } from '>/mockBackend/groups'
import { toUserInfo } from '>/mockBackend/users'

import { cursorPaginated, post } from './mockAxios'

import { ctx, db } from './index'

let nextId = 1
export function generateApplication (params) {
  const group = db.groups.find(group => group.id === params.group)
  return {
    id: nextId++,
    user: ctx.authUser.id,
    createdAt: new Date(),
    questions: group.applicationQuestions,
    answers: faker.random.words(10),
    status: 'pending',
    decidedBy: null,
    decidedAt: null,
    ...params,
  }
}

export function toApplicationInfo (application) {
  return {
    ...application,
    // we actually embed the user in the application
    user: toUserInfo(db.users.find(user => user.id === application.user)),
  }
}

export function acceptApplication (user, group) {
  const application = db.applications.find(application => application.group === group.id && application.user === user.id)
  if (!application) throw new Error('no application for this group+user')
  addUserToGroup(user, group, { roles: [] })
  Object.assign(application, {
    status: 'accepted',
    decidedAt: new Date(),
    decidedBy: null, // TODO: who by?
  })
  return application
}

export function createMockApplicationsBackend () {
  cursorPaginated(
    '/api/applications/',
    ({ params }) => db.applications
      .filter(application => {
        const { group, user, status } = params
        if (group && application.group !== group) return false
        if (user && application.user !== user) return false
        if (status && application.status !== status) return false
        return true
      })
      .map(toApplicationInfo),
  )

  post('/api/applications/', ({ data: application }) => {
    Object.assign(application, generateApplication(application))
    db.applications.push(application)
    return [200, toApplicationInfo(application)]
  })
}
