import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import NotificationItem from './NotificationItem'

let notificationIdCnt = 0
const makeNotification = data => {
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
const makeApplication = data => {
  return {
    id: applicationIdCnt++,
    createdAt: new Date(),
    user: makeUser(),
    group: null,
    conversation: null,
    questions: 'What are your motivations for joining slköaslkfjasdfasfd?',
    answers: 'asdfasdf',
    status: 'pending',
    decidedBy: null,
    decidedAt: null,
    ...data,
  }
}

let groupIdCnt = 0
const makeGroup = data => {
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

const makeMembership = data => {
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
const makeUser = data => {
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

const makeUserProfile = data => {
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

const makeCurrentUser = data => {
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
const makeStore = data => {
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
    ...data,
  }
}

let pickupIdCnt = 0
const makePickup = data => {
  return {
    id: pickupIdCnt++,
    date: new Date(),
    series: null,
    store: null,
    max_collectors: 10,
    collector_ids: [],
    description: '',
    ...data,
  }
}

const currentUser = makeCurrentUser()
const group = makeGroup({
  memberships: {
    [currentUser.id]: makeMembership(),
  },
})

const notifications = [
  {
    type: 'user_became_editor',
    context: {
      group,
      user: makeUser(),
    },
  },
  {
    type: 'you_became_editor',
    context: {
      group,
    },
  },
  {
    type: 'new_applicant',
    context: {
      group,
      user: makeUser(),
      application: makeApplication({
        group,
        createdAt: new Date('2018-07-23T19:28:09.875Z'),
      }),
    },
  },
  {
    type: 'application_accepted',
    context: {
      group,
      application: makeApplication({
        group,
        status: 'accepted',
        decidedBy: currentUser,
        decidedAt: new Date('2018-09-17T19:28:09.875Z'),
      }),
    },
  },
  {
    type: 'application_declined',
    context: {
      group,
      application: makeApplication({
        group,
        status: 'declined',
        decidedBy: currentUser,
        decidedAt: new Date('2018-09-17T19:28:09.875Z'),
      }),
    },
  },
  {
    type: 'feedback_possible',
    context: {
      group,
      pickup: makePickup({
        store: makeStore({
          group,
        }),
      }),
    },
  },
  {
    type: 'new_store',
    context: {
      group,
      store: makeStore({
        group,
      }),
      user: makeUser(),
    },
  },
  {
    type: 'new_member',
    context: {
      group,
      user: makeUser(),
    },
  },
  {
    type: 'invitation_accepted',
    context: {
      group,
      user: makeUser(),
    },
  },
].map(makeNotification)

const on = {
  open: action('open'),
}

const story = storiesOf('Notifications', module)

for (const notification of notifications) {
  story.add(notification.type, () => defaults({
    render: h => h(NotificationItem, {
      props: {
        notification,
      },
      on,
    }),
  }))
}
