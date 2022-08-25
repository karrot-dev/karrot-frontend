import cloneDeep from 'clone-deep'

import { makeUser } from '>/enrichedFactories'
import { mountWithDefaults, createDatastore } from '>/helpers'
import { joinableActivity, currentUserMock } from '>/mockdata'

import ActivityUsers from './ActivityUsers'

describe.skip('ActivityUsers', () => {
  beforeEach(() => jest.resetModules())
  let wrapper, activity, datastore

  beforeEach(() => {
    activity = cloneDeep(joinableActivity)
    datastore = createDatastore({
      auth: { getters: { user: () => currentUserMock } },
    })
  })

  it('renders', () => {
    wrapper = mountWithDefaults(ActivityUsers, {
      propsData: {
        activity,
      },
      datastore,
    })
    expect(wrapper.vm.emptyPlaces).toBe(0)
    expect(wrapper.vm.emptySlots).toBe(0)
    expect(wrapper.vm.canJoin).toBe(true)
  })

  it('shows more participants than slots', () => {
    activity.participants = [
      makeUser(),
      makeUser(),
      makeUser(),
      makeUser(),
      makeUser(),
    ]
    activity.maxParticipants = 4
    wrapper = mountWithDefaults(ActivityUsers, {
      propsData: {
        activity,
      },
      datastore,
    })
    expect(wrapper.vm.emptyPlaces).toBe(0)
  })
})
