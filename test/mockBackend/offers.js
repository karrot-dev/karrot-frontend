import { faker } from '@faker-js/faker'

import { cursorPaginated, getById, post } from './mockAxios'

import { ctx, db } from './index'

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
    user: null,
    group: null,
    images: [],
    ...params,
  }
}

export function createMockOffersBackend () {
  cursorPaginated(
    '/api/offers/',
    () => db.offers,
    ({ params }) => {
      const status = params.status
      const group = parseInt(params.group || '1')
      const filterFn = offer => offer.status === status && offer.group === group
      if (status === 'archived') {
        // only show archived ones for current user
        return offer => filterFn(offer) && offer.user === ctx.authUser.id
      }
      return filterFn
    },
  )

  getById('/api/offers/:id/', () => db.offers)

  post('/api/offers/', ({ data: offer }) => {
    // TODO: implement validation errors that match the backend
    if (!offer.group) return [400]
    offer.user = ctx.authUser.id
    offer.createdAt = new Date()
    db.offers.push(offer)
    return [200, offer]
  })
}
