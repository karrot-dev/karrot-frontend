import { faker } from '@faker-js/faker'
import { pick } from 'lodash'

import { groupIdsForUser } from '>/mockBackend/groups'

import { get } from './mockAxios'

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

export function toUserInfo (user) {
  return pick(user, [
    'id',
    'username',
    'displayName',
    'latitude',
    'longitude',
    'photoUrls',
  ])
}

export function toUserDetail (user) {
  return {
    ...user,
    groups: groupIdsForUser(user),
  }
}

export function createMockUsersBackend () {
  get('/api/users/', () => [200, db.users.map(toUserInfo)])
  get('/api/users/:id/profile/', ({ pathParams }) => {
    // TODO: add filters... not all users should be accessible...
    const user = db.orm.users.get({ id: parseInt(pathParams.id) }, null)
    if (!user) return [404]
    return [200, toUserDetail(user)]
  })
}
