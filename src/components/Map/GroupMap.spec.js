import GroupMap from './GroupMap'
import { usersMock, storesMock } from '>/mockdata'

import Vue2Leaflet from 'vue2-leaflet'
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
  stores: storesMock,
  showUsers: true,
  showStores: true,
  currentGroup: {},
}

describe('GroupMap', () => {
  beforeEach(() => jest.resetModules())
  it('renders users and stores', async () => {
    let wrapper = mountWithDefaults(GroupMap, {
      propsData: defaultProps,
    })
    await Vue.nextTick()
    expect(wrapper.findAll(Vue2Leaflet.LMap).length).toBe(1)
    expect(wrapper.findAll(ExtendedMarker).length).toBe(usersMock.length + storesMock.length)
    for (const marker of wrapper.findAll(ExtendedMarker)) {
      expect(marker.props().opacity).toEqual(1)
    }
    expect(wrapper.findAll(Vue2Leaflet.LPopup).length).toBe(usersMock.length + storesMock.length)
  })

  it('renders just users', async () => {
    let wrapper = mountWithDefaults(GroupMap, {
      propsData: {
        ...defaultProps,
        showStores: false,
      },
    })
    await Vue.nextTick()
    expect(wrapper.findAll(ExtendedMarker).length).toBe(usersMock.length)
    expect(wrapper.findAll(Vue2Leaflet.LPopup).length).toBe(usersMock.length)
  })

  it('renders just stores', async () => {
    let wrapper = mountWithDefaults(GroupMap, {
      propsData: {
        ...defaultProps,
        showUsers: false,
      },
    })
    await Vue.nextTick()
    expect(wrapper.findAll(ExtendedMarker).length).toBe(storesMock.length)
    expect(wrapper.findAll(Vue2Leaflet.LPopup).length).toBe(storesMock.length)
  })
})
