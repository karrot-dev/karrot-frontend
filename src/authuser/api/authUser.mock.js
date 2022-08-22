import { faker } from '@faker-js/faker'

import { createBackend } from '>/mockAxios'

let nextId = 1
export function createAuthUser (params = {}) {
  const email = faker.internet.email()
  return {
    id: ++nextId,
    username: faker.internet.userName(),
    display_name: faker.name.findName(),
    email,
    unverified_email: email,
    mobile_number: '',
    address: null,
    latitude: null,
    longitude: null,
    description: faker.lorem.paragraphs(2),
    mail_verified: true,
    current_group: null,
    language: 'en',
    photo_urls: {},
    ...params,
  }
}

export function createAuthUserBackend (user) {
  createBackend('/api/auth/user/', user)
}
