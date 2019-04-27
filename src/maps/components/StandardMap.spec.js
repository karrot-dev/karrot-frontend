import StandardMap from './StandardMap'
import { groupMarker } from './markers'
import { makeGroup } from '>/enrichedFactories'

import * as Vue2Leaflet from 'vue2-leaflet'
import ExtendedMarker from './ExtendedMarker'
import { mountWithDefaults, nextTicks } from '>/helpers'

const markers = [...Array(20).keys()].map(e => groupMarker(makeGroup()))

describe('StandardMap', () => {
  beforeEach(() => jest.resetModules())
  it('renders markers with popups', async () => {
    let wrapper = mountWithDefaults(StandardMap, {
      propsData: {
        markers,
      },
    })
    await nextTicks(1)
    expect(wrapper.findAll(Vue2Leaflet.LMap).length).toBe(1)
    expect(wrapper.findAll(ExtendedMarker).length).toBe(markers.length)
    expect(wrapper.findAll(Vue2Leaflet.LPopup).length).toBe(markers.length)

    // add and remove some markers
    for (let i = 0; i < 3; i++) {
      wrapper.setProps({ markers: markers.filter((e, idx) => idx !== i) })
      await nextTicks(1)
      expect(wrapper.findAll(ExtendedMarker).length).toBe(markers.length - 1)
      expect(wrapper.findAll(Vue2Leaflet.LPopup).length).toBe(markers.length - 1)
    }
  })
})
