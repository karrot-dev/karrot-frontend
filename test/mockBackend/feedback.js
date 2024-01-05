import { faker } from '@faker-js/faker'
import { uniq } from 'lodash'

import { toActivityResponse } from '>/mockBackend/activities'
import { createFeedback, ctx, db } from '>/mockBackend/index'
import { cursorPaginated, post } from '>/mockBackend/mockAxios'

let nextId = 1
export function generateFeedback (params = {}) {
  if (!params.about) throw new Error('must pass about')
  if (!params.givenBy) throw new Error('must pass givenBy')
  return {
    id: nextId++,
    weight: null,
    comment: faker.lorem.paragraph(3),
    about: null,
    givenBy: null,
    createdAt: faker.date.past(),
    ...params,
  }
}

export function toFeedbackResponse (feedback) {
  return {
    ...feedback,
    isEditable: feedback.givenBy === ctx.authUser?.id, // probably has a time limit too...
  }
}

export function createMockFeedbackBackend () {
  cursorPaginated(
    '/api/feedback/',
    () => db.feedback,
    {
      makeResults: feedback => {
        const activities = uniq(feedback.map(entry => entry.about))
          .map(id => db.orm.activities.get({ id }))
        return {
          feedback: feedback.map(toFeedbackResponse),
          activities: activities.map(toActivityResponse),
        }
      },
    },
  )

  post('/api/feedback/', ({ data }) => {
    const feedback = createFeedback({
      ...data,
      givenBy: ctx.authUser.id,
      createdAt: new Date(),
    })
    return [200, toFeedbackResponse(feedback)]
  })
}
