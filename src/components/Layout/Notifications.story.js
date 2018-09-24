import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import addHours from 'date-fns/add_hours'
import * as factories from '>/enrichedFactories'

import NotificationItem from './NotificationItem'

const currentUser = factories.makeCurrentUser()
const group = factories.makeGroup({
  memberships: {
    [currentUser.id]: factories.makeMembership(),
  },
})
const store = factories.makeStore({
  group,
})

const notifications = [
  {
    type: 'user_became_editor',
    context: {
      group,
      user: factories.makeUser(),
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
      user: factories.makeUser(),
      application: factories.makeApplication({
        group,
        createdAt: new Date('2018-07-23T19:28:09.875Z'),
      }),
    },
  },
  {
    type: 'application_accepted',
    context: {
      group,
      application: factories.makeApplication({
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
      application: factories.makeApplication({
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
      pickup: factories.makePickup({
        store,
      }),
    },
  },
  {
    type: 'new_store',
    context: {
      group,
      store,
      user: factories.makeUser(),
    },
  },
  {
    type: 'new_member',
    context: {
      group,
      user: factories.makeUser(),
    },
  },
  {
    type: 'invitation_accepted',
    context: {
      group,
      user: factories.makeUser(),
    },
  },
  {
    type: 'pickup_upcoming',
    expiresAt: addHours(new Date(), 2),
    context: {
      group,
      store,
      pickup: factories.makePickup({
        store,
      }),
    },
  },
].map(factories.makeNotification)

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
