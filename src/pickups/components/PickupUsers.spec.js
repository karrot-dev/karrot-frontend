import PickupUsers from './PickupUsers'
import { joinablePickup, currentUserMock } from '>/mockdata'
import cloneDeep from 'clone-deep'

import { mountWithDefaults, createDatastore, polyfillRequestAnimationFrame } from '>/helpers'
import { makeUser } from '>/enrichedFactories'

polyfillRequestAnimationFrame()

describe('PickupUsers', () => {
  beforeEach(() => jest.resetModules())
  let wrapper, pickup, datastore

  beforeEach(() => {
    pickup = cloneDeep(joinablePickup)
    datastore = createDatastore({
      auth: { getters: { user: () => currentUserMock } },
    })
  })

  it('renders', () => {
    wrapper = mountWithDefaults(PickupUsers, {
      propsData: {
        pickup,
      },
      datastore,
    })
    expect(wrapper.vm.emptyPlaces).toBe(0)
    expect(wrapper.vm.emptySlots).toBe(0)
    expect(wrapper.vm.canJoin).toBe(true)
  })

  it('shows more collectors than slots', () => {
    pickup.collectors = [
      makeUser(),
      makeUser(),
      makeUser(),
      makeUser(),
      makeUser(),
    ]
    pickup.maxCollectors = 4
    wrapper = mountWithDefaults(PickupUsers, {
      propsData: {
        pickup,
      },
      datastore,
    })
    expect(wrapper.vm.emptyPlaces).toBe(0)
  })
})
