import { createAuthUserBackend } from '@/authuser/api/authUser.mock'
import { createMockGroupDetailBackend } from '@/group/api/groups.mock'
import { createMockGroupsInfoBackend } from '@/groupInfo/api/groupsInfo.mock'
import { createMockOffersBackend } from '@/offers/api/offers.mock'
import { createMockPlacesBackend } from '@/places/api/places.mock'
import { createMockUsersBackend } from '@/users/api/users.mock'

import { mockAxios } from '>/mockAxios'

/**
 * Creates a fake backend that can be used in tests.
 *
 * Internally holds a mini database of entries that each backend
 * module can use how it wishes, so things that cross-reference each
 * other can work.
 *
 * It's a bit basic still, let's see how it goes...
 *
 * We currently just pass the db to the setup function, but the idea
 * is we could include helper functions for setting the db to a useful
 * state.
 */
export function createMockBackend (setup) {
  const db = {
    users: [],
    places: [],
    offers: [],
    groups: [],
    authUser: null,
  }
  createMockGroupDetailBackend(db)
  createAuthUserBackend(db)
  createMockGroupsInfoBackend(db)
  createMockPlacesBackend(db)
  createMockUsersBackend(db)
  createMockOffersBackend(db)
  if (setup) {
    setup({ db })
  }
}

export function removeMockBackend () {
  mockAxios.reset()
}
