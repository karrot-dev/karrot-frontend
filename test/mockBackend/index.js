import addDays from 'date-fns/addDays'

import { createMockActivitiesBackend, generateActivity } from '>/mockBackend/activities'
import { createMockActivityTypesBackend, generateActivityType } from '>/mockBackend/activityTypes'
import { createMockCommunityBackend } from '>/mockBackend/community'
import { createMockFeedbackBackend, generateFeedback } from '>/mockBackend/feedback'
import { createMockHistoryBackend } from '>/mockBackend/history'

import { generateActivitySeries } from './activitySeries'
import { createMockApplicationsBackend, generateApplication } from './applications'
import { createAuthUserBackend } from './authUser'
import { addUserToConversation, generateConversation } from './conversations'
import { createMockGroupDetailBackend, generateGroup } from './groups'
import { createMockGroupsInfoBackend } from './groupsInfo'
import { createMockIssuesBackend, generateIssue, generateVoting } from './issues'
import { createMockMessagesBackend, generateMessage } from './messages'
import { initializeMockAxios, resetMockAxios, get } from './mockAxios'
import { generateNotification, createMockNotificationsBackend } from './notifications'
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
    feedback: [],
    applications: [],
    activities: [],
    activitySeries: [],
    activityTypes: [],
    notifications: [],
    issues: [],
    conversations: [],
    messages: [],
  }
  db.orm = {
    users: createFinder(db, 'users'),
    feedback: createFinder(db, 'feedback'),
    groups: createFinder(db, 'groups'),
    places: createFinder(db, 'places'),
    conversations: createFinder(db, 'conversations'),
    issues: createFinder(db, 'issues'),
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
  createMockIssuesBackend()
  createMockGroupsInfoBackend()
  createMockGroupDetailBackend()
  createMockPlacesBackend()
  createMockFeedbackBackend()
  createMockHistoryBackend()
  createMockUsersBackend()
  createMockOffersBackend()
  createMockStatusBackend()
  createMockCommunityBackend()
  createMockNotificationsBackend()
  createMockMessagesBackend()

  get('/api/bootstrap/', () => [200, {}])

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
  createConversation({
    group: group.id,
    type: 'group',
    targetId: group.id,
  })
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

export function createActivitySeries (params) {
  const series = generateActivitySeries(params)
  db.activitySeries.push(series)
  return series
}

export function createActivityType (params) {
  const activityType = generateActivityType(params)
  db.activityTypes.push(activityType)
  return activityType
}

export function createNotification (params) {
  const notification = generateNotification(params)
  db.notifications.push(notification)
  return notification
}

export function createApplication (params) {
  const application = generateApplication(params)
  db.applications.push(application)
  return application
}

export function createIssue (params) {
  const issue = generateIssue({
    ...params,
    votings: [
      generateVoting({
        createdAt: new Date(),
        expiresAt: addDays(new Date(), 7),
      }),
    ],
  })
  const conversation = createConversation({
    group: issue.group,
    type: 'issue',
    targetId: issue.id,
  })
  const group = db.orm.groups.get({ id: issue.group })
  for (const user of group.members.map(id => db.orm.users.get({ id }))) {
    // TODO: I _think_ this is what we do? dump everyone in? maybe changing soon!
    addUserToConversation(user, conversation)
  }
  db.issues.push(issue)
  return issue
}

export function createConversation (params) {
  const conversation = generateConversation(params)
  db.conversations.push(conversation)
  return conversation
}

export function createMessage (params) {
  const message = generateMessage(params)
  db.messages.push(message)
  return message
}

export function createFeedback (params) {
  const feedback = generateFeedback(params)
  db.feedback.push(feedback)
  return feedback
}

export function setPageSize (pageSize) {
  ctx.pageSize = pageSize
}

// This creates a finder object that is _a little bit_ like django ORM stuff
function createFinder (db, dbKey) {
  // Find a list of entries that match the params
  // e.g. filter({ type: 'group', targetId: 3 }) will return an array of matches
  // you can also pass a function as the filter value, e.g.
  // filter({ place: id => placeIds.includes(id) })
  function filter (params) {
    return db[dbKey].filter(entry => Object.keys(params).every(field => {
      if (typeof params[field] === 'function') {
        return params[field](entry[field])
      }
      return entry[field] === params[field]
    }))
  }

  // Find ONE entry with the specified params
  // E.g. get({ id: 2 }) will return a single entry
  // If there are more than 1 it'll throw an error (regardless of a default value)
  // If there are no entries it'll throw and error UNLESS you provide a defaultValue
  // If there are no entries AND you provide a default value that is different to "undefined", it'll return that
  function get (params, defaultValue) {
    const entries = filter(params)
    if (entries.length > 1) throw new Error(`more than one entry! ${dbKey} for ${JSON.stringify(params)}`)
    if (entries.length === 0) {
      if (defaultValue !== undefined) return defaultValue
      throw new Error(`no ${dbKey} for ${JSON.stringify(params)}`)
    }
    return entries[0]
  }

  return {
    filter,
    get,
  }
}
