import { faker } from '@faker-js/faker'

import { filterByAuthUserGroups } from '>/mockBackend/groups'
import { realSample } from '>/mockBackend/utils'

import { cursorPaginated, getById, post } from './mockAxios'

import { ctx, db } from './index'

let nextId = 1
export function generateOffer (params = {}) {
  return {
    id: nextId++,
    name: faker.lorem.words(5),
    description: faker.lorem.paragraphs(2),
    status: realSample(['active', 'archived']),
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
    ({ params }) => db.offers
      .filter(filterByAuthUserGroups())
      .filter(offer => {
        const status = params.status
        if (status && offer.status !== status) return false
        // Can only view your own archived offers
        if (status === 'archived' && offer.user !== ctx.authUser.id) return false

        const group = params.group ? parseInt(params.group) : null
        if (group && offer.group !== group) return false

        return true
      }),
  )

  getById(
    '/api/offers/:id/',
    () => db.offers.filter(filterByAuthUserGroups()),
  )

  post('/api/offers/', ({ data: offer }) => {
    // TODO: implement validation errors that match the backend
    if (!offer.group) return [400, 'must pass a group']
    offer.id = nextId++
    offer.user = ctx.authUser.id
    offer.createdAt = new Date()
    db.offers.push(offer)
    return [200, offer]
  })
}
