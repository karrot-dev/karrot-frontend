import { faker } from '@faker-js/faker'

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
}
