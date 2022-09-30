import { faker } from '@faker-js/faker'

import { filterByAuthUserGroups } from '>/mockBackend/groups'

import { cursorPaginated, getById, post } from './mockAxios'

import { createAgreement, db } from './index'

let nextId = 1
export function generateAgreement (params = {}) {
  return {
    id: nextId++,
    title: faker.random.words(5),
    summary: faker.lorem.paragraphs(2),
    content: faker.lorem.paragraphs(10),
    activeFrom: faker.date.past(),
    activeTo: null,
    reviewAt: null,
    group: null,
    createdBy: null,
    lastUpdatedBy: null,
    ...params,
  }
}

export function createMockAgreementsBackend () {
  cursorPaginated(
    '/api/agreements/',
    ({ params }) => db.agreements
      .filter(filterByAuthUserGroups())
      .filter(agreement => {
        // TODO: filters!
        return true
      }),
  )

  getById(
    '/api/agreements/:id/',
    () => db.agreements.filter(filterByAuthUserGroups()),
  )

  post('/api/agreements/', ({ data: agreement }) => {
    // TODO: implement validation errors that match the backend
    if (!agreement.group) return [400, 'must pass a group']
    return [200, createAgreement(agreement)]
  })
}
