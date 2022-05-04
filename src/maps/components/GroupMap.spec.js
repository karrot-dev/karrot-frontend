import GroupMap from './GroupMap'
import { usersMock, placesMock } from '>/mockdata'

import * as VueLeaflet from '@vue-leaflet/vue-leaflet'
import ExtendedMarker from './ExtendedMarker'
import { mountWithDefaults } from '>/helpers'
import { flushPromises } from '@vue/test-utils'

/* vue-leaflet library does not name some of its components, which vue-test-utils needs to find them
   so we give them names here... */
VueLeaflet.LMap.name = 'VueLeafletMap'
VueLeaflet.LTileLayer.name = 'VueLeafletTileLayer'

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
    expect(wrapper.findAllComponents(VueLeaflet.LMap).length).toBe(1)
    expect(wrapper.findAllComponents(ExtendedMarker).length).toBe(usersMock.length + placesMock.length)
    for (const marker of wrapper.findAllComponents(ExtendedMarker)) {
      expect(marker.props().opacity).toEqual(1)
    }
    expect(wrapper.findAllComponents(VueLeaflet.LPopup).length).toBe(usersMock.length + placesMock.length)
  })

  it('renders just users', async () => {
    const wrapper = mountWithDefaults(GroupMap, {
      propsData: {
        ...defaultProps,
        showPlaces: false,
      },
    })
    await flushPromises()
    expect(wrapper.findAllComponents(ExtendedMarker).length).toBe(usersMock.length)
    expect(wrapper.findAllComponents(VueLeaflet.LPopup).length).toBe(usersMock.length)
  })

  it('renders just places', async () => {
    const wrapper = mountWithDefaults(GroupMap, {
      propsData: {
        ...defaultProps,
        showUsers: false,
      },
    })
    await flushPromises()
    expect(wrapper.findAllComponents(ExtendedMarker).length).toBe(placesMock.length)
    expect(wrapper.findAllComponents(VueLeaflet.LPopup).length).toBe(placesMock.length)
  })
})
