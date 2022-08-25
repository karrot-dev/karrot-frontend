import { createMockActivitiesBackend, generateActivity } from '>/mockBackend/activities'
import { createMockActivityTypesBackend, generateActivityType } from '>/mockBackend/activityTypes'
import { createMockApplicationsBackend } from '>/mockBackend/applications'
import { createMockCommunityBackend } from '>/mockBackend/community'

import { createAuthUserBackend } from './authUser'
import { createMockGroupDetailBackend, generateGroup } from './groups'
import { createMockGroupsInfoBackend } from './groupsInfo'
import { initializeMockAxios, resetMockAxios, get } from './mockAxios'
import { createMockOffersBackend, generateOffer } from './offers'
import { createMockPlacesBackend, generatePlace } from './places'
import { createMockStatusBackend } from './status'
import { createMockUsersBackend, generateUser } from './users'

export let db
export let ctx

/**
 * Creates a fake backend that can be used in tests.
 *
 * Internally holds a mini database of entries that each backend
 * module can use how it wishes, so things that cross-reference each
 * other can work.
 */
export function useMockBackend () {
  beforeEach(setupMockBackend)
  afterEach(resetMockBackend)
}

export function setupMockBackend () {
  db = {
    users: [],
    places: [],
    offers: [],
    groups: [],
    applications: [],
    activities: [],
    activityTypes: [],
  }
  db.orm = {
    places: createFinder(db, 'places'),
    activities: createFinder(db, 'activities'),
    activityTypes: createFinder(db, 'activityTypes'),
  }
  ctx = {
    authUser: null,
  }
  initializeMockAxios()

  createAuthUserBackend()
  createMockApplicationsBackend()
  createMockActivitiesBackend()
  createMockActivityTypesBackend()
  createMockGroupsInfoBackend()
  createMockGroupDetailBackend()
  createMockPlacesBackend()
  createMockUsersBackend()
  createMockOffersBackend()
  createMockStatusBackend()
  createMockCommunityBackend()

  get('/about.json', () => [200, {
    commitSHA: 'blah',
    commitSHAShort: 'blah',
    ref: 'blah',
    env: 'local',
    apkURL: null,
    date: new Date().toISOString().replace(/T.*/, ''),
  }], {
    requireAuth: false,
  })
}

export function resetMockBackend () {
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

export function createPlace (params) {
  const place = generatePlace(params)
  db.places.push(place)
  return place
}

export function createActivity (params) {
  const activity = generateActivity(params)
  db.activities.push(activity)
  return activity
}

export function createActivityType (params) {
  const activityType = generateActivityType(params)
  db.activityTypes.push(activityType)
  return activityType
}

export function setPageSize (pageSize) {
  ctx.pageSize = pageSize
}

function createFinder (db, dbKey) {
  return {
    get (filter) {
      const entries = db[dbKey].filter(entry => Object.keys(filter).every(field => entry[field] === filter[field]))
      if (entries.length > 1) throw new Error(`more than one entry! ${dbKey} for ${JSON.stringify(filter)}`)
      if (entries.length === 0) throw new Error(`no ${dbKey} for ${JSON.stringify(filter)}`)
      return entries[0]
    },
  }
}
