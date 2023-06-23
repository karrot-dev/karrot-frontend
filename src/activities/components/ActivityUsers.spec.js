import cloneDeep from 'clone-deep'

import { makeUser } from '>/enrichedFactories'
import { mountWithDefaults, createDatastore } from '>/helpers'
import { participantType, joinableActivity, currentUserMock } from '>/mockdata'

import ActivityUsers from './ActivityUsers.vue'

describe.skip('ActivityUsers', () => {
  beforeEach(() => vi.resetModules())
  let wrapper, activity, datastore

  beforeEach(() => {
    activity = cloneDeep(joinableActivity)
    datastore = createDatastore({
      auth: { getters: { user: () => currentUserMock } },
    })
  })

  it('renders', async () => {
    wrapper = await mountWithDefaults(ActivityUsers, {
      propsData: {
        activity,
        participantType,
      },
      datastore,
    })
    expect(wrapper.vm.emptyPlaces).toBe(1)
    expect(wrapper.vm.emptySlots).toBe(1)
  })

  it('shows more participants than slots', async () => {
    activity.participants = [
      { user: makeUser(), participantType },
      { user: makeUser(), participantType },
      { user: makeUser(), participantType },
      { user: makeUser(), participantType },
      { user: makeUser(), participantType },
    ]
    activity.maxParticipants = 4
    wrapper = await mountWithDefaults(ActivityUsers, {
      propsData: {
        activity,
        participantType,
      },
      datastore,
    })
    expect(wrapper.vm.emptyPlaces).toBe(0)
  })
})
