import { faker } from '@faker-js/faker'

import { createGetByIdBackend } from '>/mockAxios'

let nextId = 1
export function createGroupDetail ({ members = [] }) {
  const memberships = {}
  for (const member of members) {
    memberships[member.id] = {
      created_at: faker.date.past(),
      added_by: null,
      roles: [
        'editor',
      ],
      active: true,
      trusted_by: [],
    }
  }
  return {
    id: ++nextId,
    name: faker.random.words(5),
    description: faker.lorem.paragraphs(2),
    welcome_message: faker.lorem.paragraphs(2),
    public_description: faker.lorem.paragraphs(2),
    application_questions: faker.lorem.paragraphs(2),
    application_questions_default: faker.lorem.paragraphs(2),
    members: members.map(member => member.id),
    memberships,
    address: faker.address.streetAddress(true),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    timezone: faker.address.timeZone(),
    status: 'active',
    theme: 'foodsaving',
    features: [
      'offers',
    ],
    notification_types: [],
    is_open: false,
    trust_threshold_for_newcomer: 1,
    member_inactive_after_days: 30,
    issue_voting_duration_days: 7,
    photo_urls: {},
  }
}

export function createMockGroupDetailBackend (db) {
  createGetByIdBackend('/api/groups/:id/', () => db.groups)
}
