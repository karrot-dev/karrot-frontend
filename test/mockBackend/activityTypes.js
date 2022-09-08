
import { faker } from '@faker-js/faker'

import en from '@/locales/locale-en.json'

import { db } from '>/mockBackend/index'
import { get, post, patch } from '>/mockBackend/mockAxios'
import { sample } from '>/mockBackend/offers'

export const translatableActivityTypeNames = Object.keys(en.ACTIVITY_TYPE_NAMES)

let nextId = 1
export function generateActivityType (params = {}) {
  if (!params.group) throw new Error('must provide group')
  return {
    id: nextId++,
    name: sample(translatableActivityTypeNames),
    colour: 'AD1457',
    icon: 'fas fa-handshake',
    hasFeedback: true,
    hasFeedbackWeight: false,
    feedbackIcon: 'fas fa-reply',
    status: 'active',
    group: null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...params,
  }
}

function toResponse (activityType) {
  return {
    ...activityType,
    nameIsTranslatable: translatableActivityTypeNames.includes(activityType.name),
  }
}

export function createMockActivityTypesBackend () {
  get(
    '/api/activity-types/',
    () => [200, db.activityTypes.map(toResponse)],
  )

  post(
    '/api/activity-types/',
    ({ data }) => {
      if (!data.name) return [400, { name: 'name should not be empty!' }]
      const activityType = generateActivityType({ ...data })
      db.activityTypes.push(activityType)
      return [201, toResponse(activityType)]
    },
  )

  patch(
    '/api/activity-types/:id/',
    ({ pathParams, data }) => {
      const activityType = db.activityTypes.find(({ id }) => id === parseInt(pathParams.id))
      if (!activityType) return [404, {}]
      Object.assign(activityType, data)
      return [200, toResponse(activityType)]
    },
  )
}
