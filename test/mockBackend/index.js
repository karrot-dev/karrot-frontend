import { createAuthUserBackend } from './authUser'
import { createMockGroupDetailBackend, generateGroup } from './groups'
import { createMockGroupsInfoBackend } from './groupsInfo'
import { initializeMockAxios, resetMockAxios } from './mockAxios'
import { createMockOffersBackend, generateOffer } from './offers'
import { createMockPlacesBackend } from './places'
import { createMockUsersBackend, generateUser } from './users'

export let db
export let ctx

export function useMockBackend () {
  beforeEach(setupMockBackend)
  afterEach(resetMockBackend)
}

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
function setupMockBackend () {
  db = {
    users: [],
    places: [],
    offers: [],
    groups: [],
  }
  ctx = {
    authUser: null,
  }
  initializeMockAxios()

  createAuthUserBackend()
  createMockGroupsInfoBackend()
  createMockGroupDetailBackend()
  createMockPlacesBackend()
  createMockUsersBackend()
  createMockOffersBackend()
}

function resetMockBackend () {
  db = null
  ctx = null
  resetMockAxios()
}

export function loginAs (user) {
  ctx.authUser = user
}

export function createUser (params) {
  const user = generateUser(params)
  db.users.push(user)
  return user
}

export function createOffer (params) {
  const offer = generateOffer(params)
  db.offers.push(offer)
  return offer
}

export function createGroup (params) {
  const group = generateGroup(params)
  db.groups.push(group)
  return group
}

export function setPageSize (pageSize) {
  ctx.pageSize = pageSize
}
