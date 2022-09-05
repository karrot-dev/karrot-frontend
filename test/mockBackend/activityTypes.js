
import { faker } from '@faker-js/faker'

import en from '@/locales/locale-en.json'

import { db } from '>/mockBackend/index'
import { get, post } from '>/mockBackend/mockAxios'
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
      const activityType = generateActivityType({ ...data })
      db.activityTypes.push(activityType)
      return [201, toResponse(activityType)]
    },
  )
}
