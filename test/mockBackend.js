import { createAuthUser, createAuthUserBackend } from '@/authuser/api/authUser.mock'
import { createGroupDetail, createMockGroupDetailBackend } from '@/group/api/groups.mock'
import { createMockGroupsInfoBackend } from '@/groupInfo/api/groupsInfo.mock'
import { createMockOffersBackend } from '@/offers/api/offers.mock'
import { createMockPlacesBackend } from '@/places/api/places.mock'
import { createMockUsersBackend } from '@/users/api/users.mock'

import { mockAxios } from '>/mockAxios'

export function createMockBackend (setup) {
  const users = []
  const places = []
  const offers = []
  const groups = []
  const authUser = createAuthUser()
  const currentGroup = createGroupDetail({
    members: [authUser],
  })
  groups.push(currentGroup)
  authUser.current_group = currentGroup.id
  createMockGroupDetailBackend([currentGroup])
  createAuthUserBackend(authUser)
  createMockGroupsInfoBackend(groups)
  createMockPlacesBackend(places)
  createMockUsersBackend(users)
  createMockOffersBackend(offers)
  setup({
    authUser,
    currentGroup,
    users,
    places,
    offers,
  })
}

export function removeMockBackend () {
  mockAxios.reset()
}
