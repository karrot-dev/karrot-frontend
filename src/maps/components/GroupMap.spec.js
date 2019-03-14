import GroupMap from './GroupMap'
import { usersMock, placesMock } from '>/mockdata'

import * as Vue2Leaflet from 'vue2-leaflet'
import ExtendedMarker from './ExtendedMarker'
import { mountWithDefaults } from '>/helpers'
import Vue from 'vue'

/* vue2-leaflet library does not name its components, which vue-test-utils needs to find them
   so we give them names here... */
Vue2Leaflet.LMap.name = 'Vue2LeafletMap'
Vue2Leaflet.LTileLayer.name = 'Vue2LeafletTileLayer'
Vue2Leaflet.LPopup.name = 'Vue2LeafletPopup'
Vue2Leaflet.LMarker.name = 'Vue2LeafletMarker'

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
    let wrapper = mountWithDefaults(GroupMap, {
      propsData: defaultProps,
    })
    await Vue.nextTick()
    expect(wrapper.findAll(Vue2Leaflet.LMap).length).toBe(1)
    expect(wrapper.findAll(ExtendedMarker).length).toBe(usersMock.length + placesMock.length)
    for (const marker of wrapper.findAll(ExtendedMarker)) {
      expect(marker.props().opacity).toEqual(1)
    }
    expect(wrapper.findAll(Vue2Leaflet.LPopup).length).toBe(usersMock.length + placesMock.length)
  })

  it('renders just users', async () => {
    let wrapper = mountWithDefaults(GroupMap, {
      propsData: {
        ...defaultProps,
        showPlaces: false,
      },
    })
    await Vue.nextTick()
    expect(wrapper.findAll(ExtendedMarker).length).toBe(usersMock.length)
    expect(wrapper.findAll(Vue2Leaflet.LPopup).length).toBe(usersMock.length)
  })

  it('renders just places', async () => {
    let wrapper = mountWithDefaults(GroupMap, {
      propsData: {
        ...defaultProps,
        showUsers: false,
      },
    })
    await Vue.nextTick()
    expect(wrapper.findAll(ExtendedMarker).length).toBe(placesMock.length)
    expect(wrapper.findAll(Vue2Leaflet.LPopup).length).toBe(placesMock.length)
  })
})
