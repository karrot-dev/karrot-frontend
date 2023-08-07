import { convert } from '@/activities/api/activities'

import {
  createActivity,
  createActivityType, createFeedback,
  createGroup,
  createPlace,
  createPlaceType,
  createUser,
  loginAs,
} from '>/mockBackend'
import { joinActivity, toResponse } from '>/mockBackend/activities'
import { addUserToGroup } from '>/mockBackend/groups'

import ActivityItem from './ActivityItem.vue'

const group = createGroup()
createPlaceType({ group: group.id })
const place = createPlace({ group: group.id })
createActivityType({ group: group.id })
const activity = createActivity({ place: place.id })
const user = createUser()
addUserToGroup(user, group)

const activityWithParticipants = createActivity({
  place: place.id,
  description: 'You can join this activity.',
})
const otherUser = createUser()
addUserToGroup(otherUser, group)
joinActivity(activityWithParticipants, otherUser)

loginAs(user)

export default {
  component: ActivityItem,
}

export const Normal = {
  args: {
    activity: convert(toResponse(activity)),
  },
}

export const ReadOnly = {
  args: {
    // give it some feedback too
    activity: convert(toResponse({
      ...activityWithParticipants,
      feedback: [
        createFeedback({
          givenBy: otherUser.id,
          weight: 25.4,
          about: activityWithParticipants.id,
        }),
        createFeedback({
          givenBy: user.id,
          weight: 102.1,
          about: activityWithParticipants.id,
        }),
      ],
    })),
    readOnly: true,
  },
}

/*

TODO: implement these other activity item states

const joinableActivity = createActivity({
  participants: range(3).map(() => ({
    user: user.id,
    participantType,
  })),
  description: 'You can join this activity.',
})
const fullActivity = makeActivity({
  participants: range(4).map(() => ({
    user: makeUser(),
    participantType,
  })),
  description: 'This activity is already full.',
})
const leavableActivity = makeActivity({
  participants: [
    ...range(2).map(makeUser),
    user,
  ].map(user => ({
    user,
    participantType,
  })),
  description: 'You can leave this activity.',
})

storiesOf('ActivityItem', module)
  .add('join', () => defaults({
    render: () => h(ActivityItem, {
      activity: joinableActivity,
    }),
  }))
  .add('joined', () => defaults({
    render: () => h(ActivityItem, {
      activity: leavableActivity,
    }),
  }))
  .add('pending', () => defaults({
    render: () => h(ActivityItem, {
      activity: joinableActivity,
    }),
  }))
  .add('full', () => defaults({
    render: () => h(ActivityItem, {
      activity: fullActivity,
    }),
  }))
  .add('disabled', () => defaults({
    render: () => h(ActivityItem, {
      activity: {
        ...fullActivity,
        isDisabled: true,
      },
    }),
  }))
  .add('started', () => defaults({
    render: () => h(ActivityItem, {
      activity: {
        ...fullActivity,
      },
    }),
  }))
*/
