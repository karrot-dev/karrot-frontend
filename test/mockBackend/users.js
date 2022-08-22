import { faker } from '@faker-js/faker'
import { pick } from 'lodash'

import { createBackend } from './mockAxios'

import { db } from './index'

let nextId = 1

/**
 * This is a full a user, which we need to cut down for different API responses.
 *
 */
export function generateUser (params) {
  const email = faker.internet.email()
  return {
    id: nextId++,
    username: faker.internet.userName(),
    displayName: faker.name.findName(),
    email,
    unverifiedEmail: email,
    mobileNumber: '',
    address: null,
    latitude: null,
    longitude: null,
    description: faker.lorem.paragraphs(2),
    mailVerified: true,
    currentGroup: null,
    language: 'en',
    photoUrls: {},
    ...params,
  }
}

function toUserInfo (user) {
  return pick(user, [
    'id',
    'username',
    'displayName',
    'latitude',
    'longitude',
    'photoUrls',
  ])
}

export function createMockUsersBackend () {
  createBackend('/api/users/', () => db.users.map(toUserInfo))
}
