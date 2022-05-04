import StandardMap from './StandardMap'
import { groupMarker } from './markers'
import { makeGroup } from '>/enrichedFactories'

import * as VueLeaflet from '@vue-leaflet/vue-leaflet'
import ExtendedMarker from './ExtendedMarker'
import { mountWithDefaults } from '>/helpers'
import { flushPromises } from '@vue/test-utils'

const markers = [...Array(20).keys()].map(e => groupMarker(makeGroup()))

describe('StandardMap', () => {
  beforeEach(() => jest.resetModules())
  it('renders markers with popups', async () => {
    const wrapper = mountWithDefaults(StandardMap, {
      propsData: {
        markers,
      },
    })
    await flushPromises()
    expect(wrapper.findAllComponents(VueLeaflet.LMap).length).toBe(1)
    expect(wrapper.findAllComponents(ExtendedMarker).length).toBe(markers.length)
    expect(wrapper.findAllComponents(VueLeaflet.LPopup).length).toBe(markers.length)

    // add and remove some markers
    for (let i = 0; i < 3; i++) {
      await wrapper.setProps({ markers: markers.filter((e, idx) => idx !== i) })
      await flushPromises()
      expect(wrapper.findAllComponents(ExtendedMarker).length).toBe(markers.length - 1)
      expect(wrapper.findAllComponents(VueLeaflet.LPopup).length).toBe(markers.length - 1)
    }
  })
})
