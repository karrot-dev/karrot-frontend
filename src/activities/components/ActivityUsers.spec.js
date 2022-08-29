import ActivityUsers from './ActivityUsers'
import { participantType, joinableActivity, currentUserMock } from '>/mockdata'
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
        participantType,
      },
      datastore,
    })
    expect(wrapper.vm.emptyPlaces).toBe(1)
    expect(wrapper.vm.emptySlots).toBe(1)
  })

  it('shows more participants than slots', () => {
    activity.participants = [
      { user: makeUser(), participantType },
      { user: makeUser(), participantType },
      { user: makeUser(), participantType },
      { user: makeUser(), participantType },
      { user: makeUser(), participantType },
    ]
    activity.maxParticipants = 4
    wrapper = mountWithDefaults(ActivityUsers, {
      propsData: {
        activity,
        participantType,
      },
      datastore,
    })
    expect(wrapper.vm.emptyPlaces).toBe(0)
  })
})
