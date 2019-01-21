/**
 * These factories are supposed to mimick enriched objects, similar to those that can be retrieved from vuex
 * This is useful for:
 * 1. get props for components tests
 * 2. verify getter output in tests for vuex modules
 *
 * The implementations are not complete, so if you miss a property that you need, please add it!
 */
import subHours from 'date-fns/sub_hours'
import addHours from 'date-fns/add_hours'

let notificationIdCnt = 0
export const makeNotification = data => {
  return {
    id: notificationIdCnt++,
    type: 'new_applicant',
    createdAt: new Date(),
    expiresAt: null,
    clicked: false,
    context: {},
    ...data,
  }
}

let applicationIdCnt = 0
export const makeApplication = data => {
  return {
    id: applicationIdCnt++,
    createdAt: new Date(),
    user: makeUser(),
    group: makeGroup(),
    conversation: null,
    questions: 'What are your motivations for joining slköaslkfjasdfasfd?',
    answers: 'I can live off fire!',
    status: 'pending',
    decidedBy: null,
    decidedAt: null,
    type: 'application',
    ...data,
  }
}

let groupIdCnt = 0
export const makeGroup = data => {
  const id = groupIdCnt++
  return {
    id,
    name: `Group ${id}`,
    displayName: 'FoodShaving Inc.',
    description: '',
    publicDescription: '',
    applicationQuestions: '',
    applicationQuestionsDefault: '',
    members: [],
    memberships: {},
    address: '',
    latitude: 0,
    longitude: 0,
    timezone: 'Europe/Berlin',
    activeAgreement: null,
    status: 'active',
    notificationTypes: [
      'weekly_summary',
      'daily_pickup_notification',
      'new_application',
    ],
    isOpen: true,
    trustThresholdForNewcomer: 1,
    ...data,
  }
}

export const makeMembership = data => {
  return {
    createdAt: new Date(),
    addedBy: null,
    roles: [
      'editor',
    ],
    active: true,
    trustedBy: [],
    ...data,
  }
}

let userIdCnt = 0
export const makeUser = data => {
  const id = userIdCnt++
  return {
    id,
    displayName: `User ${id}`,
    photoUrls: {},
    latitude: null,
    longitude: null,
    ...data,
  }
}

export const makeUserProfile = data => {
  return {
    ...makeUser(),
    email: 'foo@foo.com',
    mobileNumber: '',
    address: '',
    description: '',
    groups: [],
    ...data,
  }
}

export const makeCurrentUser = data => {
  return {
    ...makeUserProfile(),
    unverifiedEmail: 'foo@foo.com',
    mailVerified: true,
    currentGroup: 1,
    language: 'en',
    ...data,
  }
}

let storeIdCnt = 0
export const makeStore = data => {
  const id = storeIdCnt++
  return {
    id,
    name: `Store ${id}`,
    description: '',
    group: null,
    address: '',
    latitude: 0,
    longitude: 0,
    weeksInAdvance: 4,
    status: 'active',
    isActiveStore: false,
    ...data,
  }
}

let pickupIdCnt = 0
export const makePickup = data => {
  return {
    id: pickupIdCnt++,
    date: new Date(),
    series: null,
    store: null,
    maxCollectors: 10,
    collectorIds: [],
    feedbackGivenBy: [],
    hasStarted: false,
    description: '',
    isDisabled: false,
    ...data,
  }
}

let pickupSeriesIdCnt = 0
export const makePickupSeries = data => {
  return {
    id: pickupSeriesIdCnt++,
    store: null,
    maxCollectors: 10,
    byDay: ['TU'],
    freq: 'WEEKLY',
    isCustom: false,
    custom: 'FREQ=WEEKLY;BYDAY=TU',
    startDate: new Date(),
    description: '',
    datesPreview: [],
    ...data,
  }
}

let conversationIdCnt = 0
export const makeConversation = data => {
  return {
    id: conversationIdCnt++,
    participants: [],
    seenUpTo: new Date(),
    unreadMessageCount: null,
    emailNotification: true,
    fetchStatus: {
      pending: false,
    },
    messages: [
      makeMessage(),
      makeMessage(),
      makeMessage(),
    ],
    type: 'group',
    ...data,
  }
}

let messageIdCnt = 0
export const makeMessage = data => {
  return {
    id: messageIdCnt++,
    author: makeUser(),
    content: 'and then I went to the beach',
    createdAt: subHours(new Date(), 3),
    ...data,
  }
}

let votingIdCnt = 0
export const makeVoting = data => {
  return {
    id: votingIdCnt++,
    acceptedOption: 74,
    expiresAt: addHours(new Date(), 106),
    options: [{
      affected_user: 174,
      id: 73,
      sumScore: 7.0,
      message: null,
      type: 'furtherDiscussion' },
    { affectedUser: 174,
      id: 74,
      sumScore: 5.0,
      message: null,
      type: 'removeUser' },
    { affectedUser: 174,
      id: 75,
      sumScore: 8.0,
      message: null,
      type: 'offlineMediation' },
    { affectedUser: 174,
      id: 76,
      sumScore: -1.0,
      message: null,
      type: 'noChange' },
    ],
    participantCount: 6,
    ...data,
  }
}

let issueIdCnt = 0
export const makeIssue = data => {
  return {
    id: issueIdCnt++,
    createdAt: subHours(new Date(), 26),
    topic: 'I complain about this user',
    type: 'conflictResolution',
    createdBy: makeUser(),
    affectedUser: makeUser(),
    group: makeGroup(),
    isDecided: false,
    votings: [
      makeVoting({
        expiresAt: '2019-01-24T21:22:54.730980Z',
      }),
      makeVoting({
        expiresAt: '2019-01-20T21:22:54.730980Z',
      }),
      makeVoting({
        expiresAt: '2019-01-22T21:22:54.730980Z',
      }),
    ],
    ...data,
  }
}

let historyIdCnt = 0
export const makeHistory = data => {
  return {
    id: historyIdCnt++,
    date: subHours(new Date(), 26),
    typus: 'GROUP_CHANGE_PHOTO',
    group: makeGroup(),
    users: [ 222 ],
    store: null,
    message: 'Changed the group picture',
    ...data,
  }
}
