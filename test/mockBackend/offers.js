import { faker } from '@faker-js/faker'

import { createCursorPaginatedBackend, createGetByIdBackend } from './mockAxios'

import { db } from './index'

function sample (items) {
  return items[Math.floor(Math.realRandom() * items.length)]
}

let nextId = 1
export function generateOffer (params = {}) {
  return {
    id: nextId++,
    name: faker.random.words(5),
    description: faker.lorem.paragraphs(2),
    status: sample(['active', 'archived']),
    createdAt: faker.date.past(),
    group: null,
    images: [],
    ...params,
  }
}

export function createMockOffersBackend () {
  createCursorPaginatedBackend('/api/offers/', () => db.offers, ({ params }) => {
    const status = params.status
    const group = parseInt(params.group || '1')
    return offer => offer.status === status && offer.group === group
  })

  createGetByIdBackend('/api/offers/:id/', () => db.offers)
}
