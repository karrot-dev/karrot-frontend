import Vue from 'vue'

import PickupEdit from './PickupEdit.vue'
import { pickupsMock } from '>/mockdata'
import cloneDeep from 'clone-deep'

import { mountWithDefaults, polyfillRequestAnimationFrame } from '>/helpers'

polyfillRequestAnimationFrame()

describe('PickupEdit', () => {
  let wrapper
  let pickup
  let serverError

  beforeEach(() => {
    pickup = cloneDeep(pickupsMock[0])
    serverError = jest.fn()
    wrapper = mountWithDefaults(PickupEdit, { propsData: { pickup, status: {}, serverError } })
  })

  it('renders', () => {
    expect(wrapper.element.className).toBe('edit')
  })

  it('can reset to initial state', () => {
    wrapper.vm.pickupEdit.description = 'changed'
    wrapper.vm.pickupEdit.maxCollectors++
    wrapper.vm.reset()
    expect(wrapper.vm.pickupEdit).toEqual(pickup)
  })

  it('detects if you have changed something', () => {
    expect(wrapper.vm.hasChanged).toBe(false)
    wrapper.vm.pickupEdit.maxCollectors++
    expect(wrapper.vm.hasChanged).toBe(true)
    return Vue.nextTick(() => {
      expect(wrapper.hasClass('changed')).toBe(true)
    })
  })

  it('emits a save event with a diff of changes', () => {
    wrapper.vm.pickupEdit.maxCollectors++
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ id: pickup.id, maxCollectors: pickup.maxCollectors + 1 })
  })
})
