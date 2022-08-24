import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { partition, times } from 'lodash'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import {
  useMockBackend,
  createUser,
  createGroup,
  createOffer,
  loginAs,
  db,
  setPageSize,
  createPlace, createActivity, createActivityType,
} from '>/mockBackend'
import { translatableActivityTypeNames } from '>/mockBackend/activityTypes'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'

import { sample } from '>/mockBackend/offers'

import GroupActivities from './GroupActivities'

describe('GroupActivities', () => {
  let places
  let activities
  let activityTypes
  useMockBackend()

  beforeEach(() => {
    jest.resetModules()
    resetServices()
  })

  beforeEach(() => {
    const user = createUser()
    const group = createGroup()
    addUserToGroup(user, group)
    user.currentGroup = group.id
    setPageSize(3) // make it have to do pagination stuff too...
    places = times(3, () => createPlace({ group: group.id }))
    activityTypes = times(
      3,
      idx => createActivityType({
        name: translatableActivityTypeNames[idx],
        group: group.id,
      }),
    )
    activities = times(
      5,
      idx => createActivity({
        // ensure we use each place and activity type at least once
        // (keep number of activities higher than either)
        place: places[idx % places.length].id,
        activityType: activityTypes[idx % activityTypes.length].id,
      }),
    )
    loginAs(user)
  })

  it('renders a list of activities', async () => {
    const { findByText, findAllByText } = render(GroupActivities, withDefaults())

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
    const { findByText, queryByText } = render(GroupActivities, withDefaults())

    const activityType = sample(activityTypes)
    await fireEvent.click(await findByText('All types'))
    await fireEvent.click(await findByText(activityType.name))

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
      expect(queryByText(re)).not.toBeInTheDocument()
    }
  })

  it('can sign up for activity', async () => {
    setPageSize(100) // don't want to deal with pagination here
    const { findByText, getByRole, findByRole, findAllByTestId } = render(GroupActivities, withDefaults())

    // find a slot we can sign into and click it!
    const joinSlots = await findAllByTestId('join-slot')
    await fireEvent.click(sample(joinSlots))

    // confirm our attendance
    await findByText(/Are you sure you have time/)
    await fireEvent.click(getByRole('button', { name: 'Yes, of course!' }))

    // TODO: add mock websockets, for now we need to manually invalidate...
    await require('@/base/vue-query').queryClient.invalidateQueries()

    // when we're signed up we get a nice Download ICS link
    // TODO: is there another way to find out we signed up?? filter by slots=joined?
    await findByRole('link', { name: 'Download ICS' })

    // one less slot to join
    const updatedJoinSlots = await findAllByTestId('join-slot')
    expect(updatedJoinSlots.length).toEqual(joinSlots.length - 1)
  })
})
