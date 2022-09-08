import { faker } from '@faker-js/faker'
import { sum } from 'lodash'

import { get } from './mockAxios'

import { db } from './index'

let nextId = 1
export function generatePlace (params = {}) {
  return {
    id: nextId++,
    name: faker.random.words(5),
    description: faker.lorem.paragraphs(2),
    group: null,
    address: null,
    latitude: null,
    longitude: null,
    weeksInAdvance: 4,
    status: 'active',
    isSubscribed: false,
    subscribers: [],
    placeType: null, // I don't think they are used yet...
    defaultView: 'activities',
    ...params,
  }
}

export function createMockPlacesBackend () {
  get('/api/places/', () => [200, db.places])
  get('/api/places/:id/statistics/', ({ pathParams }) => {
    const activityIds = db.orm.activities.filter({ place: parseInt(pathParams.id) }).map(activity => activity.id)
    const feedback = db.orm.feedback.filter({ about: id => activityIds.includes(id) })
    return [200, {
      feedbackCount: feedback.length,
      feedbackWeight: sum(feedback.map(entry => entry.weight || 0)),
      // TODO: make it add 'em up!
      activitiesDone: 0,
    }]
  })
}
