import { addHours, startOfYesterday } from 'date-fns'
import { range } from 'lodash'
import {
  getRouter,
} from 'vue-router-mock'

import ActivityFeedback from '@/feedback/pages/ActivityFeedback.vue'
import { defineStory } from '@/utils/storybookUtils'

import {
  createActivity,
  createActivityType,
  createGroup,
  createPlace,
  createPlaceType,
  createUser,
  loginAs,
} from '>/mockBackend'
import { joinActivity } from '>/mockBackend/activities'
import { addUserToGroup } from '>/mockBackend/groups'

async function generateMockData () {
  const group = createGroup()
  createPlaceType({ group: group.id })
  const place = createPlace({ group: group.id })
  const activityType = createActivityType({ group: group.id, hasFeedbackWeight: true })
  const activityTypeNoWeight = createActivityType({ group: group.id, hasFeedbackWeight: false })

  const startDate = addHours(startOfYesterday(), 10)

  const canGiveFeedbackActivity = createActivity({ startDate, place: place.id, activityType: activityType.id })
  const canGiveFeedbackActivityNoWeight = createActivity({ startDate: addHours(startDate, 25), place: place.id, activityType: activityTypeNoWeight.id })

  const user = createUser()
  addUserToGroup(user, group)

  joinActivity(canGiveFeedbackActivity, user)
  joinActivity(canGiveFeedbackActivityNoWeight, user)

  range(2).forEach(() => {
    const otherUser = createUser()
    addUserToGroup(otherUser, group)
    joinActivity(canGiveFeedbackActivity, otherUser)
  })

  range(4).forEach(() => {
    const otherUser = createUser()
    addUserToGroup(otherUser, group)
    joinActivity(canGiveFeedbackActivityNoWeight, otherUser)
  })

  loginAs(user)

  // Our component uses route params
  // So we need a mock route to get the params from
  const router = getRouter()
  router.addRoute({
    name: 'giveFeedback',
    path: '/:groupId/:activityId',
    component: {},
  })
  router.push({ name: 'giveFeedback', params: { groupId: group.id, activityId: canGiveFeedbackActivity.id } })
}

export default {
  // component: DebugPage,
  component: ActivityFeedback,
}

export const Normal = defineStory(() => {
  generateMockData()
})
