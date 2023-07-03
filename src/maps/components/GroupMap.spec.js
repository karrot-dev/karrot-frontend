import { flushPromises } from '@vue/test-utils'
import { vi } from 'vitest'

import KMap from '@/maps/components/KMap.vue'
import KMarker from '@/maps/components/KMarker.vue'
import PlaceMarker from '@/maps/components/PlaceMarker.vue'
import UserMarker from '@/maps/components/UserMarker.vue'

import { mountWithDefaults } from '>/helpers'
import { placesMock, usersMock } from '>/mockdata'

import GroupMap from './GroupMap.vue'

const defaultProps = {
  users: usersMock,
  places: placesMock,
  showUsers: true,
  showPlaces: true,
  currentGroup: {
    membership: {
      isEditor: true,
    },
  },
}

describe.skip('GroupMap', () => {
  beforeEach(() => { vi.resetModules() })
  it('renders users and places', async () => {
    const wrapper = await mountWithDefaults(GroupMap, {
      propsData: defaultProps,
    })
    await flushPromises()
    expect(wrapper.findAllComponents(KMap).length).toBe(1)
    expect(wrapper.findAllComponents(KMarker).length).toBe(usersMock.length + placesMock.length)
    for (const marker of wrapper.findAllComponents(KMarker)) {
      expect(marker.props().opacity).toEqual(1)
    }
    expect(wrapper.findAllComponents(UserMarker).length).toBe(usersMock.length)
    expect(wrapper.findAllComponents(PlaceMarker).length).toBe(placesMock.length)
  })

  it('renders just users', async () => {
    const wrapper = await mountWithDefaults(GroupMap, {
      propsData: {
        ...defaultProps,
        showPlaces: false,
      },
    })
    await flushPromises()
    expect(wrapper.findAllComponents(KMarker).length).toBe(usersMock.length)
    expect(wrapper.findAllComponents(UserMarker).length).toBe(usersMock.length)
  })

  it('renders just places', async () => {
    const wrapper = await mountWithDefaults(GroupMap, {
      propsData: {
        ...defaultProps,
        showUsers: false,
      },
    })
    await flushPromises()
    expect(wrapper.findAllComponents(KMarker).length).toBe(placesMock.length)
    expect(wrapper.findAllComponents(PlaceMarker).length).toBe(placesMock.length)
  })
})
