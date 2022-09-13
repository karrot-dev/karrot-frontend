import { h } from 'vue'

import { convert } from '@/activities/api/activities'

import { createActivity, createActivityType, createGroup, createPlace, createUser, loginAs } from '>/mockBackend'
import { toResponse } from '>/mockBackend/activities'

import ActivityItem from './ActivityItem'

const group = createGroup()
const place = createPlace({ group: group.id })
createActivityType({ group: group.id })
const activity = createActivity({ place: place.id })
const user = createUser()

loginAs(user)

export default {
  component: ActivityItem,
}

const Template = (args) => ({
  setup () {
    return () => h(ActivityItem, args)
  },
})

export const Normal = Template.bind({})

Normal.args = {
  activity: convert(toResponse(activity)),
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
