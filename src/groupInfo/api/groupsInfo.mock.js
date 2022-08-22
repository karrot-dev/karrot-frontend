import { faker } from '@faker-js/faker'

import { createBackend } from '>/mockAxios'

let nextId = 1
export function createGroupInfo (params = {}) {
  return {
    id: ++nextId,
    name: faker.random.words(5),
    public_description: faker.lorem.paragraphs(2),
    application_questions: faker.lorem.paragraphs(2),
    address: null,
    latitude: null,
    longitude: null,
    member_count: 1,
    is_member: false,
    status: 'active',
    theme: 'foodsaving',
    is_open: false,
    photo_urls: {},
    distance: null,
    ...params,
  }
}

function groupDetailToGroupInfo (groupDetail) {
  const groupInfo = createGroupInfo()
  // Copy keys we have on the info over
  for (const key of Object.keys(groupInfo)) {
    groupInfo[key] = groupDetail[key]
  }
  // ... and we leave everything else the same
  // TODO: some might be wrong, e.g. is_member ....
  return groupInfo
}

export function createMockGroupsInfoBackend (entries, options = {}) {
  createBackend('/api/groups-info/', entries, { transform: groupDetailToGroupInfo })
}
