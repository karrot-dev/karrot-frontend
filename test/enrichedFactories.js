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

import { statusMocks } from '>/helpers'

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

let placeIdCnt = 0
export const makePlace = data => {
  const id = placeIdCnt++
  return {
    id,
    name: `Place ${id}`,
    description: '',
    group: null,
    address: '',
    latitude: 0,
    longitude: 0,
    weeksInAdvance: 4,
    status: 'active',
    isActivePlace: false,
    ...data,
  }
}

let pickupIdCnt = 0
export const makePickup = data => {
  return {
    id: pickupIdCnt++,
    date: new Date(),
    series: null,
    place: null,
    maxCollectors: 10,
    collectors: [],
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
    place: null,
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

let votingIdCnt = 0
export const makeVoting = data => {
  return {
    id: votingIdCnt++,
    acceptedOption: 74,
    expiresAt: addHours(new Date(), 106),
    options: [{
      affectedUser: 174,
      id: 73,
      sumScore: 7.0,
      message: null,
      yourScore: null,
      type: 'further_discussion',
    },
    { affectedUser: 174,
      id: 74,
      sumScore: 5.0,
      message: null,
      yourScore: null,
      type: 'remove_user',
    },
    { affectedUser: 174,
      id: 76,
      sumScore: -1.0,
      message: null,
      yourScore: null,
      type: 'no_change',
    },
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
    status: 'ongoing',
    votings: [
      makeVoting({
        expiresAt: new Date('2018-01-24T21:22:54.730980Z'),
      }),
      makeVoting({
        expiresAt: new Date('2018-05-20T21:22:54.730980Z'),
      }),
      makeVoting({
        expiresAt: new Date('2018-11-22T21:22:54.730980Z'),
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

export const makeReaction = date => {
  return {
    name: 'thumbsup',
    users: [makeUser()],
    reacted: false,
    message: 'a reacted with :thumbsup:',
    ...date,
  }
}

let messageIdCnt = 0
export const makeMessage = data => {
  const id = messageIdCnt++
  return {
    id,
    content: `hello ${id}!`,
    author: makeUser(),
    createdAt: new Date(),
    updatedAt: new Date(),
    editedAt: new Date(),
    receivedVia: '',
    isEditable: false,
    reactions: [makeReaction()],
    isUnread: false,
    isEdited: false,
    groupId: null,
    thread: null,
    threadMeta: null,
    saveStatus: statusMocks.default(),
    ...data,
  }
}

export const makeThread = data => {
  return {
    ...makeMessage(),
    messages: [
      makeMessage(),
      makeMessage(),
      makeMessage(),
    ],
    sendStatus: statusMocks.default(),
    fetchStatus: statusMocks.default(),
    canFetchFuture: false,
    fetchFutureStatus: statusMocks.default(),
    ...data,
  }
}

let conversationIdCnt = 0
export const makeConversation = data => {
  return {
    id: conversationIdCnt++,
    participants: [makeUser()],
    updatedAt: new Date(),
    seenUpTo: null,
    unreadMessageCount: 0,
    muted: false,
    isClosed: false,
    isParticipant: true,
    type: null,
    targetId: null,
    target: null,
    sendStatus: statusMocks.default(),
    fetchStatus: statusMocks.default(),
    canFetchPast: false,
    fetchPastStatus: statusMocks.default(),
    canFetchFuture: false,
    fetchFutureStatus: statusMocks.default(),
    markStatus: statusMocks.default(),
    messages: [
      makeMessage(),
      makeMessage(),
      makeMessage(),
      makeMessage(),
    ],
    ...data,
  }
}
