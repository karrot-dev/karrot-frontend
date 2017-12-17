import Vue from 'vue'

import PickupEdit from './PickupEdit'
import { pickupsMock } from '>/mockdata'
import cloneDeep from 'clone-deep'

import { mountWithDefaults, polyfillRequestAnimationFrame, statusMocks } from '>/helpers'

polyfillRequestAnimationFrame()

describe('PickupEdit', () => {
  let wrapper, pickup, unenriched

  beforeEach(() => {
    pickup = cloneDeep(pickupsMock[0])
    unenriched = cloneDeep(pickupsMock[0])
    wrapper = mountWithDefaults(PickupEdit, { propsData: { value: pickup, status: statusMocks.default() } })
  })

  it('renders', () => {
    expect(wrapper.element.className).toBe('edit')
  })

  it('can reset to initial state', () => {
    wrapper.vm.edit.description = 'changed'
    wrapper.vm.edit.maxCollectors++
    wrapper.vm.reset()
    expect(wrapper.vm.edit).toEqual(unenriched)
  })

  it('detects if you have changed something', () => {
    expect(wrapper.vm.hasChanged).toBe(false)
    wrapper.vm.edit.maxCollectors++
    expect(wrapper.vm.hasChanged).toBe(true)
    return Vue.nextTick(() => {
      expect(wrapper.hasClass('changed')).toBe(true)
    })
  })

  it('emits a save event with a diff of changes', () => {
    wrapper.vm.edit.maxCollectors++
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ id: pickup.id, maxCollectors: pickup.maxCollectors + 1 })
  })
})
