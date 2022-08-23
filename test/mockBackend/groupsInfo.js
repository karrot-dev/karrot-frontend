import { pick } from 'lodash'

import { get } from './mockAxios'

import { ctx, db } from './index'

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
  get('/api/groups-info/', () => [200, db.groups.map(toGroupInfo)], { requireAuth: false })
}
