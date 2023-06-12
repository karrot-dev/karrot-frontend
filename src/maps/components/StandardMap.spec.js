import { flushPromises } from '@vue/test-utils'

import GroupMarker from '@/maps/components/GroupMarker.vue'
import KMap from '@/maps/components/KMap.vue'
import KMarker from '@/maps/components/KMarker.vue'

import { makeGroup } from '>/enrichedFactories'
import { mountWithDefaults } from '>/helpers'

import StandardMap from './StandardMap.vue'
import { groupMarker } from './markers'

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
    expect(wrapper.findAllComponents(KMap).length).toBe(1)
    expect(wrapper.findAllComponents(KMarker).length).toBe(markers.length)
    expect(wrapper.findAllComponents(GroupMarker).length).toBe(markers.length)

    // add and remove some markers
    for (let i = 0; i < 3; i++) {
      await wrapper.setProps({ markers: markers.filter((e, idx) => idx !== i) })
      await flushPromises()
      expect(wrapper.findAllComponents(KMarker).length).toBe(markers.length - 1)
      expect(wrapper.findAllComponents(GroupMarker).length).toBe(markers.length - 1)
    }
  })
})
