import Vue from 'vue'

import PickupSeriesEdit from './PickupSeriesEdit'
import { pickupSeriesMock } from '>/mockdata'
import cloneDeep from 'clone-deep'

import { mountWithDefaults, polyfillRequestAnimationFrame } from '>/helpers'

polyfillRequestAnimationFrame()

describe('PickupSeriesEdit', () => {
  beforeEach(() => jest.resetModules())
  let wrapper
  let series

  beforeEach(() => {
    series = cloneDeep(pickupSeriesMock[0])
    wrapper = mountWithDefaults(PickupSeriesEdit, {
      propsData: {
        value: series,
        status: { pending: false, validationErrors: {} },
      },
    })
  })

  it('renders', () => {
    expect(wrapper.element.className).toBe('edit-box')
  })

  it('can toggle the days', () => {
    const labels = [...wrapper.findAll('.q-item-label')]

    const monday = labels.find(label => label.text() === 'Monday')
    const friday = labels.find(label => label.text() === 'Friday')

    monday.trigger('click')
    expect(wrapper.vm.edit.rule.byDay).toContain('MO')

    friday.trigger('click')
    expect(wrapper.vm.edit.rule.byDay).toContain('FR')

    monday.trigger('click')
    expect(wrapper.vm.edit.rule.byDay).not.toContain('MO')
  })

  it('can reset to initial state', () => {
    wrapper.vm.edit.description = 'changed'
    wrapper.vm.edit.maxCollectors++
    wrapper.vm.reset()
    expect(wrapper.vm.edit).toEqual(series)
  })

  it('does not let you remove all days', async () => {
    wrapper.vm.byDay = []
    await Vue.nextTick()
    expect(wrapper.vm.edit.rule.byDay).toEqual(series.rule.byDay)
  })

  it('detects if you have changed something', async () => {
    expect(wrapper.vm.hasChanged).toBe(false)
    wrapper.vm.edit.maxCollectors++
    expect(wrapper.vm.hasChanged).toBe(true)
    await Vue.nextTick()
    expect(wrapper.classes()).toContain('changed')
  })

  it('emits a save event with a diff of changes', () => {
    wrapper.vm.edit.maxCollectors++
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ id: series.id, maxCollectors: series.maxCollectors + 1 })
  })
})
