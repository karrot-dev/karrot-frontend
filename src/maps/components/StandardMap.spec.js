import { flushPromises, mount } from '@vue/test-utils'
import { vi } from 'vitest'

import KMap from '@/maps/components/KMap.vue'
import KMarker from '@/maps/components/KMarker.vue'

import StandardMap from './StandardMap.vue'

// Define a utility to create a mock marker
function createMockMarker (id) {
  return {
    id,
    latLng: { lat: Math.random() * 100, lng: Math.random() * 100 },
    popup: 'Test Marker ' + id,
    color: 'blue',
    fontIcon: 'marker-icon',
    click_count: 0, // Initialize click_count here
  }
}

// Custom equality checker for markers
function containsMarker (container, marker) {
  return container.some(m => m.id === marker.id)
}

describe('StandardMap', () => {
  let wrapper
  let markers

  beforeEach(() => {
    vi.resetModules()
    markers = [createMockMarker(1), createMockMarker(2), createMockMarker(3), createMockMarker(4)]
    wrapper = mount(StandardMap, {
      props: { markers },
      global: {
        stubs: { KMap }, // Stub KMap to isolate the component test
      },
    })
  })

  it('selects a marker and updates localSelectedMarkers', async () => {
    const kMarker = wrapper.findAllComponents(KMarker).at(0)
    await kMarker.vm.$emit('marker-clicked', { marker: markers[0] })
    await flushPromises()

    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[0])).toBe(true)
    expect(wrapper.emitted()['update:selectedMarkers'][0]).toEqual([[markers[0]]])
  })

  it('toggles the selection state on repeated clicks', async () => {
    const kMarker = wrapper.findAllComponents(KMarker).at(0)
    // Simulate clicking the marker three times
    for (let i = 0; i < 3; i++) {
      await kMarker.vm.$emit('marker-clicked', { marker: markers[0] })
      await flushPromises()
    }

    // Check if the toggle works correctly (should end up selected since it's an odd number of clicks)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[0])).toBe(true)
    expect(wrapper.vm.localSelectedMarkers).toHaveLength(1)
    expect(markers[0].click_count).toBe(3)
  })

  it('changes selected marker and verifies the update', async () => {
    const kMarkers = wrapper.findAllComponents(KMarker)

    // Select the first marker
    await kMarkers.at(0).vm.$emit('marker-clicked', { marker: markers[0] })
    await flushPromises()

    // Select the second marker
    await kMarkers.at(1).vm.$emit('marker-clicked', { marker: markers[1] })
    await flushPromises()
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[0])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[1])).toBe(true)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[2])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[3])).toBe(false)
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[0])
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[2])
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[3])
    expect(wrapper.emitted()['update:selectedMarkers'][1]).toEqual([[markers[1]]])

    // Select the third marker
    await kMarkers.at(2).vm.$emit('marker-clicked', { marker: markers[2] })
    await flushPromises()
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[0])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[1])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[2])).toBe(true)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[3])).toBe(false)
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[0])
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[1])
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[3])
    expect(wrapper.emitted()['update:selectedMarkers'][2]).toEqual([[markers[2]]])

    // Select the fourth marker
    await kMarkers.at(3).vm.$emit('marker-clicked', { marker: markers[1] })
    await flushPromises()

    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[0])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[1])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[2])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[3])).toBe(true)
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[0])
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[1])
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[2])
    expect(wrapper.emitted()['update:selectedMarkers'][3]).toEqual([[markers[3]]])

    // Select back to the first marker
    await kMarkers.at(0).vm.$emit('marker-clicked', { marker: markers[0] })
    await flushPromises()
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[0])).toBe(true)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[1])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[2])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[3])).toBe(false)
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[1])
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[2])
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[3])
    expect(wrapper.emitted()['update:selectedMarkers'][0]).toEqual([[markers[0]]])

    // Select back to the fourth marker
    await kMarkers.at(1).vm.$emit('marker-clicked', { marker: markers[1] })
    await flushPromises()

    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[0])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[1])).toBe(true)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[2])).toBe(false)
    expect(containsMarker(wrapper.vm.localSelectedMarkers, markers[3])).toBe(false)
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[0])
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[2])
    expect(wrapper.vm.localSelectedMarkers).not.toContain(markers[3])
    expect(wrapper.emitted()['update:selectedMarkers'][1]).toEqual([[markers[1]]])
  })
})
