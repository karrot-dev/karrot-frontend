import Vue from 'vue'
import { createLocalVue, mount } from 'vue-test-utils'

import PickupEdit from './PickupEdit.vue'
import { pickupsMock } from '../mockdata'
import i18n from '@/i18n'
import cloneDeep from 'clone-deep'

import Quasar from 'quasar'

import { makeFindAllIterable, polyfillRequestAnimationFrame } from '>/helpers'

polyfillRequestAnimationFrame()

describe('PickupEdit', () => {
  let localVue
  let wrapper
  let pickup

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Quasar)
    i18n.locale = 'en'
    pickup = cloneDeep(pickupsMock[0])
    wrapper = mount(PickupEdit, {
      localVue,
      i18n,
      propsData: {
        pickup,
      },
    })
    makeFindAllIterable(wrapper)
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
