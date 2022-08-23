import { faker } from '@faker-js/faker'
import { pick } from 'lodash'

import { createBackend } from './mockAxios'

import { ctx, db } from './index'

let nextId = 1
export function createGroupInfo (params = {}) {
  return {
    id: nextId++,
    name: faker.random.words(5),
    publicDescription: faker.lorem.paragraphs(2),
    applicationQuestions: faker.lorem.paragraphs(2),
    address: null,
    latitude: null,
    longitude: null,
    memberCount: 0,
    isMember: false,
    status: 'active',
    theme: 'foodsaving',
    isOpen: false,
    photoUrls: {},
    distance: null,
    ...params,
  }
}

function toGroupInfo (group) {
  return {
    // Some fields copied over
    ...pick(group, [
      'id',
      'name',
      'publicDescription',
      'applicationQuestions',
      'address',
      'latitude',
      'longitude',
      'status',
      'theme',
      'isOpen',
      'photoUrls',
    ]),
    // Some special ones
    memberCount: group.members.length,
    isMember: ctx.authUser ? group.members.includes(ctx.authUser.id) : false,
    distance: null,
  }
}

export function createMockGroupsInfoBackend () {
  createBackend('get', '/api/groups-info/', () => db.groups.map(toGroupInfo), { requireAuth: false })
}
