import { faker } from '@faker-js/faker'
import { h } from 'vue'

import {
  createUser,
  createGroup,
  loginAs,
  createPlace,
  createActivity,
  createActivityType,
  createNotification,
  createApplication,
  createIssue,
} from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'

import Notifications from './Notifications'

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Notifications',
  component: Notifications,
}

const Template = (args) => ({
  components: { Notifications },
  setup () {
    return () => h(Notifications, args)
  },
})

export const AllNotifications = Template.bind({})

AllNotifications.args = {
  asPage: true,
}

const user = createUser()
const group = createGroup()
const currentUser = createUser()
addUserToGroup(currentUser, group)
loginAs(currentUser)
createActivityType({ group: group.id })
const place = createPlace({ group: group.id })

;[
  {
    type: 'user_became_editor',
    context: {
      group: group.id,
      user: currentUser.id,
    },
  },
  {
    type: 'you_became_editor',
    context: {
      group: group.id,
    },
  },
  {
    type: 'new_applicant',
    context: {
      group: group.id,
      user: user.id,
      application: createApplication({
        group: group.id,
      }).id,
    },
  },
  {
    type: 'application_accepted',
    context: {
      group: group.id,
      application: createApplication({
        group: group.id,
        status: 'accepted',
        decidedBy: currentUser,
        decidedAt: faker.date.past(),
      }).id,
    },
  },
  {
    type: 'application_declined',
    context: {
      group: group.id,
      application: createApplication({
        group: group.id,
        status: 'declined',
        decidedBy: currentUser,
        decidedAt: faker.date.past(),
      }).id,
    },
  },
  {
    type: 'feedback_possible',
    context: {
      group: group.id,
      activity: createActivity({ place: place.id }).id,
    },
  },
  {
    type: 'new_place',
    context: {
      group: group.id,
      place: place.id,
      user: user.id,
    },
  },
  {
    type: 'new_member',
    context: {
      group: group.id,
      user: user.id,
    },
  },
  {
    type: 'invitation_accepted',
    context: {
      group: group.id,
      user: user.id,
    },
  },
  {
    type: 'activity_upcoming',
    expiresAt: faker.date.future(),
    context: {
      group: group.id,
      place: place.id,
      activity: createActivity({ place: place.id }).id,
    },
  },
  {
    type: 'activity_disabled',
    context: {
      group: group.id,
      place: place.id,
      activity: createActivity({
        place: place.id,
      }).id,
    },
  },
  {
    type: 'activity_enabled',
    context: {
      group: group.id,
      place: place.id,
      activity: createActivity({
        place: place.id,
      }).id,
    },
  },
  {
    type: 'activity_moved',
    context: {
      group: group.id,
      place: place.id,
      activity: createActivity({
        place: place.id,
      }).id,
    },
  },
  {
    type: 'conflict_resolution_created',
    context: {
      group: group.id,
      issue: createIssue({ group: group.id }).id,
      user: user.id,
    },
  },
  {
    type: 'conflict_resolution_created_about_you',
    context: {
      group: group.id,
      issue: createIssue({ group: group.id }).id,
    },
  },
  {
    type: 'conflict_resolution_continued',
    context: {
      group: group.id,
      issue: createIssue({ group: group.id }).id,
      user: user.id,
    },
  },
  {
    type: 'conflict_resolution_continued_about_you',
    context: {
      group: group.id,
      issue: createIssue({ group: group.id }).id,
    },
  },
  {
    type: 'conflict_resolution_decided',
    context: {
      group: group.id,
      issue: createIssue({ group: group.id }).id,
      user: user.id,
    },
  },
  {
    type: 'conflict_resolution_decided_about_you',
    context: {
      group: group.id,
      issue: createIssue({ group: group.id }).id,
    },
  },
  {
    type: 'conflict_resolution_you_were_removed',
    context: {
      group: group.id,
    },
  },
  {
    type: 'voting_ends_soon',
    expiresAt: faker.date.future(),
    context: {
      group: group.id,
      issue: createIssue({ group: group.id }).id,
    },
  },
].forEach(createNotification)
