import { faker } from '@faker-js/faker'

import { createGetByIdBackend } from './mockAxios'

import { db } from './index'

let nextId = 1
export function generateGroup () {
  return {
    id: nextId++,
    name: faker.random.words(5),
    description: faker.lorem.paragraphs(2),
    welcomeMessage: faker.lorem.paragraphs(2),
    publicDescription: faker.lorem.paragraphs(2),
    applicationQuestions: faker.lorem.paragraphs(2),
    applicationQuestions_default: faker.lorem.paragraphs(2),
    members: [],
    memberships: {},
    address: faker.address.streetAddress(true),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    timezone: faker.address.timeZone(),
    status: 'active',
    theme: 'foodsaving',
    features: [
      'offers',
    ],
    notificationTypes: [],
    isOpen: false,
    trustThresholdForNewcomer: 1,
    memberInactiveAfterDays: 30,
    issueVotingDurationDays: 7,
    photoUrls: {},
  }
}

export function addMemberToGroup (member, group) {
  group.members.push(member.id)
  group.memberships[member.id] = {
    createdAt: faker.date.past(),
    addedBy: null,
    roles: [
      'editor',
    ],
    active: true,
    trustedBy: [],
  }
}

export function createMockGroupDetailBackend () {
  createGetByIdBackend('/api/groups/:id/', () => db.groups)
}
