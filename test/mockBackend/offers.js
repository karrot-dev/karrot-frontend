import { faker } from '@faker-js/faker'

import { filterByAuthUserGroups } from '>/mockBackend/groups'
import { realSample, toAPIResponse } from '>/mockBackend/utils'

import { cursorPaginated, getById, post } from './mockAxios'

import { ctx, db } from './index'

let nextId = 1
export function generateOffer (params = {}) {
  return {
    id: nextId++,
    name: faker.lorem.words(5),
    description: faker.lorem.paragraphs(2),
    createdAt: faker.date.past(),
    user: null,
    group: null,
    images: [],
    ...params,
  }
}

export function toOfferResponse (offer) {
  return toAPIResponse({
    ...offer,
    isArchived: Boolean(offer.archivedAt),
  })
}

export function createMockOffersBackend () {
  cursorPaginated(
    '/api/offers/',
    ({ params }) => db.offers
      .filter(filterByAuthUserGroups())
      .map(toOfferResponse)
      .filter(offer => {
        if (params.isArchived === true && (!offer.isArchived || offer.user !== ctx.authUser.id)) return false
        if (params.isArchived === false && offer.isArchived) return false

        const group = params.group ? parseInt(params.group) : null
        if (group && offer.group !== group) return false

        return true
      }),
  )

  getById(
    '/api/offers/:id/',
    () => db.offers.filter(filterByAuthUserGroups()).map(toOfferResponse),
  )

  post('/api/offers/', ({ data: offer }) => {
    // TODO: implement validation errors that match the backend
    if (!offer.group) return [400, 'must pass a group']
    offer.id = nextId++
    offer.user = ctx.authUser.id
    offer.createdAt = new Date()
    db.offers.push(offer)
    return [200, toOfferResponse(offer)]
  })
}
