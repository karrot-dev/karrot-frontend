import { faker } from '@faker-js/faker'

import { cursorPaginated } from './mockAxios'

import { db } from './index'

let nextId = 1
export function generateNotification (params = {}) {
  return {
    id: nextId++,
    type: 'new_applicant',
    createdAt: faker.date.past(),
    expiresAt: null,
    clicked: false,
    context: {},
    ...params,
  }
}

export function createMockNotificationsBackend () {
  cursorPaginated(
    '/api/notifications/',
    () => db.notifications,
    {
      makeResults: notifications => {
        // find related entries
        const applications = db.applications.filter(application => notifications.find(({ context }) => context.application === application.id))
        const issues = db.issues.filter(issue => notifications.find(({ context }) => context.issue === issue.id))
        const activities = db.activities.filter(activity => notifications.find(({ context }) => context.activity === activity.id))
        return {
          notifications,
          applications,
          issues,
          activities,
        }
      },
    },
  )
}
