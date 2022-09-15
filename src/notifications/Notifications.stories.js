import { faker } from '@faker-js/faker'
import { h } from 'vue'

import {
  createUser,
  createGroup,
  loginAs,
  createPlace,
  createPlaceType,
  createActivity,
  createActivityType,
  createNotification,
  createApplication,
  createIssue,
} from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'

import Notifications from './components/Notifications'

export default {
  component: Notifications,
}

const Template = (args) => ({
  setup () {
    fillBackend()
    return () => h(Notifications, args)
  },
  // TODO reset backend!
})

export const AllNotifications = Template.bind({})

AllNotifications.args = {
  asPage: true,
}

function fillBackend () {
  const user = createUser()
  const group = createGroup()
  const currentUser = createUser()
  addUserToGroup(currentUser, group)
  loginAs(currentUser)
  createActivityType({ name: 'Task', group: group.id })
  createPlaceType({ group: group.id })
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
      type: 'membership_review_created',
      context: {
        group: group.id,
        issue: createIssue({ group: group.id }).id,
        user: user.id,
      },
    },
    {
      type: 'membership_review_created_about_you',
      context: {
        group: group.id,
        issue: createIssue({ group: group.id }).id,
      },
    },
    {
      type: 'membership_review_continued',
      context: {
        group: group.id,
        issue: createIssue({ group: group.id }).id,
        user: user.id,
      },
    },
    {
      type: 'membership_review_continued_about_you',
      context: {
        group: group.id,
        issue: createIssue({ group: group.id }).id,
      },
    },
    {
      type: 'membership_review_decided',
      context: {
        group: group.id,
        issue: createIssue({ group: group.id }).id,
        user: user.id,
      },
    },
    {
      type: 'membership_review_decided_about_you',
      context: {
        group: group.id,
        issue: createIssue({ group: group.id }).id,
      },
    },
    {
      type: 'membership_review_you_were_removed',
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
}
