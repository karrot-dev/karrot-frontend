import { faker } from '@faker-js/faker'

import { toResponse as toConversationResponse } from './conversations'
import { getById, get } from './mockAxios'

import { db, ctx } from './index'

let nextId = 1
export function generateGroup (params = {}) {
  return {
    id: nextId++,
    name: faker.random.words(5),
    description: faker.lorem.paragraphs(2),
    welcomeMessage: faker.lorem.paragraphs(2),
    publicDescription: faker.lorem.paragraphs(2),
    applicationQuestions: faker.lorem.paragraphs(2),
    applicationQuestionsDefault: faker.lorem.paragraphs(2),
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
    ...params,
  }
}

export function addUserToGroup (user, group, membershipParams = {}) {
  group.members.push(user.id)
  group.memberships[user.id] = {
    createdAt: faker.date.past(),
    addedBy: null,
    roles: [
      'editor',
    ],
    active: true,
    trustedBy: [],
    ...membershipParams,
  }
}

export function groupsForUser (user) {
  return db.groups.filter(group => group.members.includes(user.id))
}

export function groupIdsForUser (user) {
  return groupsForUser(user).map(group => group.id)
}

export function filterByAuthUserGroups () {
  const groupIds = ctx.authUser ? groupIdsForUser(ctx.authUser) : []
  return entry => groupIds.includes(entry.group)
}

export function createMockGroupDetailBackend () {
  getById('/api/groups/:id/', () => groupsForUser(ctx.authUser))

  get('/api/groups/:id/conversation/', ({ pathParams }) => {
    const conversation = db.conversations.find(({ type, targetId }) => type === 'group' && targetId === parseInt(pathParams.id))
    if (!conversation) return [404]
    return [200, toConversationResponse(conversation)]
  })
}
