// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import StandardMap from './StandardMap'
import { groupMarker } from './markers'
import { makeGroup } from '>/enrichedFactories'

import { mountWithDefaults } from '>/helpers'
import { flushPromises } from '@vue/test-utils'
import KMarker from '@/maps/components/KMarker'
import KMap from '@/maps/components/KMap'
import GroupMarker from '@/maps/components/GroupMarker'

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
