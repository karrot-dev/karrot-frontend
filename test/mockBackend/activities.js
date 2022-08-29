import { faker } from '@faker-js/faker'
import { addDays, addHours, addMinutes, startOfTomorrow } from 'date-fns'

import { ctx, db } from '>/mockBackend/index'
import { cursorPaginated, post } from '>/mockBackend/mockAxios'

let nextId = 1
let nextParticipantTypeId = 1
export function generateActivity (params = {}) {
  if (!params.place) throw new Error('must provide place')
  if (!params.activityType) {
    // Auto-choose one based on place -> group
    const place = db.orm.places.get({ id: params.place })
    params.activityType = db.orm.activityTypes.get({ group: place.group }).id
  }
  const startDate = addHours(startOfTomorrow(), 10)
  const endDate = addMinutes(startDate, 30)
  return {
    id: nextId++,
    activityType: null,
    date: [
      startDate,
      endDate,
    ],
    description: faker.lorem.paragraphs(2),
    series: null,
    place: null,
    participantTypes: [{ id: nextParticipantTypeId++, role: 'member', maxParticipants: 2 }],
    participants: [],
    feedbackDue: addDays(endDate, 30), // TODO: is this about right?
    feedbackGivenBy: [],
    feedbackDismissedBy: [],
    isDisabled: false,
    hasDuration: false,
    ...params,
  }
}

function toResponse (activity) {
  return {
    ...activity,
    isDone: activity.date[1] < new Date(), // TODO: is this the right definition?
  }
}

export function createMockActivitiesBackend () {
  cursorPaginated(
    '/api/activities/',
    ({ params }) => db.activities.filter(activity => {
      if (params.group && db.orm.places.get({ id: activity.place }).group !== params.group) return false
      if (params.place && activity.place !== params.place) return false
      if (params.series && activity.series !== params.series) return false
      if (params.dateMin && activity.date[0] < params.dateMin) return false
      if (params.activityType && activity.activityType !== params.activityType) return false
      if (params.slots) {
        if (params.slots === 'joined') {
          if (!activity.participants.some(participant => participant.user === ctx.authUser.id)) return false
        }
        else {
          throw new Error(`have not implemented slots=${params.slots} filter`)
        }
      }
      if (params.feedbackPossible) throw new Error('have not implemented feedbackPossible filter')
      return true
    }).map(toResponse),
  )

  post('/api/activities/:id/add/', ({ pathParams, data }) => {
    const activity = db.orm.activities.get({ id: parseInt(pathParams.id) })
    if (activity.participants.map(participant => participant.user).includes(ctx.authUser.id)) {
      return [403, {
        detail: 'You have already joined this activity.',
        error_code: 'permission_denied',
      }]
    }
    // TODO: this is probably a required param?
    const { participantType } = data
    activity.participants.push({
      user: ctx.authUser.id,
      participantType,
      createdAt: new Date(),
    })
    return [200, {}]
  })
}
