import { faker } from '@faker-js/faker'

import { createCursorPaginatedBackend, createGetByIdBackend } from '>/mockAxios'

function sample (items) {
  return items[Math.floor(Math.realRandom() * items.length)]
}

let nextId = 1
export function createOffer (params) {
  return {
    id: ++nextId,
    name: faker.random.words(5),
    description: faker.lorem.paragraphs(2),
    status: sample(['active', 'archived']),
    created_at: faker.date.past(),
    group: 1,
    images: [],
    ...params,
  }
}

export function createMockOffersBackend (entries, options = {}) {
  createCursorPaginatedBackend('/api/offers/', entries, ({ params }) => {
    const status = params.status
    const group = parseInt(params.group || '1')
    return offer => offer.status === status && offer.group === group
  }, options)

  createGetByIdBackend('/api/offers/:id/', entries)
}
