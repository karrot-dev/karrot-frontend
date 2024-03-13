import { faker } from '@faker-js/faker'
import { addDays, addHours, addMinutes, startOfTomorrow } from 'date-fns'

import { toFeedbackResponse } from '>/mockBackend/feedback'
import { ctx, db } from '>/mockBackend/index'
import { cursorPaginated, getById, post } from '>/mockBackend/mockAxios'
import { toAPIResponse } from '>/mockBackend/utils'

let nextId = 1
export function generateActivity (params = {}) {
  if (!params.place) throw new Error('must provide place')
  if (!params.activityType) {
    // Auto-choose one based on place -> group
    const place = db.orm.places.get({ id: params.place })
    params.activityType = db.orm.activityTypes.get({ group: place.group }).id
  }
  const startDate = params.startDate || addHours(startOfTomorrow(), 10)
  delete params.startDate
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
    participantTypes: [generateParticipantType()],
    participants: [],
    feedbackDue: addDays(endDate, 30), // TODO: is this about right?
    feedbackGivenBy: [],
    feedback: [],
    feedbackDismissedBy: [],
    isDisabled: false,
    hasDuration: false,
    ...params,
  }
}

let nextParticipantTypeId = 1
export function generateParticipantType (params = {}) {
  return {
    id: nextParticipantTypeId++,
    role: 'member',
    maxParticipants: 2,
    ...params,
  }
}

export function joinActivity (activity, user, params = {}) {
  if (!params.participantType) {
    params.participantType = activity.participantTypes[0].id
  }
  activity.participants.push({
    user: user.id,
    createdAt: new Date(),
    ...params,
  })
}

export function toActivityResponse (activity) {
  const feedback = db.orm.feedback.filter({ about: activity.id })
  return toAPIResponse({
    ...activity,
    participants: activity.participants.map(participant => ({
      // Not all fields returned
      user: participant.user,
      participantType: participant.participantType,
      createdAt: participant.createdAt,
    })),
    feedback: feedback.map(toFeedbackResponse),
    feedbackDismissedBy: activity.participants.filter(participant => participant.feedbackDismissed).map(participant => participant.user),
    isDone: activity.date[1] < new Date(), // TODO: is this the right definition?
  })
}

function isFeedbackPossible (activity, user) {
  if (activity.date[1] > new Date()) return false
  if (!activity.participants.map(p => p.user).includes(user.id)) return false
  // TODO add remaining filters: feedback_possible_days, activity_type_has_feedback, feedback_given_by_user, feedback_dismissed
  return true
}

export function createMockActivitiesBackend () {
  cursorPaginated(
    '/api/activities/',
    ({ params }) => db.activities.filter(activity => {
      if (params.feedbackPossible === true && !isFeedbackPossible(activity, ctx.authUser)) return false
      if (params.feedbackPossible === false && isFeedbackPossible(activity, ctx.authUser)) return false
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
      return true
    }).map(toActivityResponse).filter(activity => {
      // Filtering after response, as we've already added in the feedback there
      if (params.hasFeedback === true) return activity.feedback.length > 0
      if (params.hasFeedback === false) return activity.feedback.length === 0
      return true
    }),
  )

  // TODO: add a few filters
  getById('/api/activities/:id/', () => db.activities)

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
    joinActivity(activity, ctx.authUser, {
      participantType,
    })
    return [200, {}]
  })

  // just a placeholder endpoint
  cursorPaginated(
    '/api/public-activities/',
    () => [],
    { requireAuth: false },
  )

  post('/api/activities/', ({ data }) => {
    if (!data.place) throw new Error('no place given for new activity, must specify one')
    const activity = generateActivity(data)
    db.activities.push(activity)
    return [201, toActivityResponse(activity)]
  })
}
