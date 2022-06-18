import GroupMap from './GroupMap'
import { usersMock, placesMock } from '>/mockdata'

import { mountWithDefaults } from '>/helpers'
import { flushPromises } from '@vue/test-utils'
import KMap from '@/maps/components/KMap'
import KMarker from '@/maps/components/KMarker'
import UserMarker from '@/maps/components/UserMarker'
import PlaceMarker from '@/maps/components/PlaceMarker'

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

describe('GroupMap', () => {
  beforeEach(() => jest.resetModules())
  it('renders users and places', async () => {
    const wrapper = mountWithDefaults(GroupMap, {
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
    const wrapper = mountWithDefaults(GroupMap, {
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
    const wrapper = mountWithDefaults(GroupMap, {
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
