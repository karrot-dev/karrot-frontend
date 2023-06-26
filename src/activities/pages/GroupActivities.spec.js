import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { partition, times } from 'lodash'
import { vi } from 'vitest'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults, invalidateQueries } from '>/helpers'
import {
  useMockBackend,
  createUser,
  createGroup,
  loginAs,
  setPageSize,
  createPlace,
  createActivity,
  createActivityType,
  createPlaceType,
  db,
} from '>/mockBackend'
import { translatableActivityTypeNames } from '>/mockBackend/activityTypes'
import { addUserToGroup } from '>/mockBackend/groups'
import { realSample } from '>/mockBackend/utils'
import '>/routerMocks'

import GroupActivities from './GroupActivities.vue'

describe('GroupActivities', () => {
  let user, group, places, activities, activityTypes
  useMockBackend()

  beforeEach(() => {
    vi.resetModules()
    resetServices()
  })

  beforeEach(() => {
    user = createUser()
    group = createGroup()
    addUserToGroup(user, group)
    user.currentGroup = group.id
    setPageSize(3) // make it have to do pagination stuff too...
    createPlaceType({ group: group.id })
    places = times(2, () => createPlace({ group: group.id }))
    activityTypes = times(
      3,
      idx => createActivityType({
        // make sure we get a few different types
        name: translatableActivityTypeNames[idx],
        group: group.id,
      }),
    )
    activities = times(
      // make sure each activity type gets a few activities
      activityTypes.length * 3,
      idx => createActivity({
        place: places[idx % places.length].id,
        activityType: activityTypes[idx % activityTypes.length].id,
      }),
    )
    loginAs(user)
  })

  it('renders a list of activities', async () => {
    const { findByText, findAllByText } = render(GroupActivities, await withDefaults())

    // place name will be there (maybe multiple times)
    for (const place of places) {
      await findAllByText(place.name)
    }

    // activity descriptions should be on the page
    for (const activity of activities) {
      // description is rendered as markdown
      // \n is rendered <br /> so we swap \n for .*
      const re = new RegExp(activity.description.split('\n').join('.*'))
      expect(await findByText(re)).toBeInTheDocument()
    }
  })

  it('can filter by activity type', async () => {
    const { findByText, queryByText, debug } = render(GroupActivities, await withDefaults())

    const activityType = realSample(activityTypes)
    await fireEvent.click(await findByText('All types'))
    await fireEvent.click(await findByText(activityType.name, {}, { timeout: 2000 }))

    await flushPromises() // give it a moment to update

    const [matchingActivities, otherActivities] = partition(
      activities,
      activity => activity.activityType === activityType.id,
    )

    for (const activity of matchingActivities) {
      const re = new RegExp(activity.description.split('\n').join('.*'))
      expect(await findByText(re)).toBeInTheDocument()
    }

    for (const activity of otherActivities) {
      const re = new RegExp(activity.description.split('\n').join('.*'))
      if (queryByText(re)) {
        debug()
        console.log(activity)
      }
      expect(queryByText(re)).not.toBeInTheDocument()
    }
  })

  it('can sign up for activity', async () => {
    setPageSize(100) // don't want to deal with pagination here
    const { findByText, getByRole, findByRole, findAllByRole } = render(GroupActivities, await withDefaults())

    // find a slot we can sign into and click it!
    const activityType = realSample(activityTypes)
    const joinButtons = await findAllByRole('button', { name: `Join ${activityType.name}` })
    await fireEvent.click(realSample(joinButtons))

    // confirm our attendance
    await findByText(/Are you sure you have time/)
    await fireEvent.click(getByRole('button', { name: 'Yes, of course!' }))

    // TODO: add mock websockets, for now we need to manually invalidate...
    await invalidateQueries()

    // when we're signed up we get a nice Download ICS link
    await findByRole('link', { name: 'Download ICS' })

    // peek at the db to see if we really joined it...
    const joinedActivities = db.activities.filter(activity => activity.participants.some(participant => participant.user === user.id))
    expect(joinedActivities).toHaveLength(1)

    // one less activity to join
    const updatedJoinButtons = await findAllByRole('button', { name: `Join ${activityType.name}` })
    expect(updatedJoinButtons.length).toEqual(joinButtons.length - 1)

    // let's go look at our joined activities
    await fireEvent.click(await findByText('All')) // the slots filter
    await fireEvent.click(await findByText('Joined'))

    await flushPromises() // needs a bit of thinking time to update...

    // We should only have one entry now...
    const chatButtons = await findAllByRole('button', { name: 'Open Chat' })
    expect(chatButtons).toHaveLength(1)
  })

  // TODO: add a test to try joining as different participant types
})
