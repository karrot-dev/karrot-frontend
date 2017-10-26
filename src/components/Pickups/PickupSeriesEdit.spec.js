import Vue from 'vue'
import { createLocalVue, mount } from 'vue-test-utils'

import PickupSeriesEdit from './PickupSeriesEdit.vue'
import { pickupSeriesMock } from '>/mockdata'
import i18n from '@/i18n'
import cloneDeep from 'clone-deep'

import Quasar from 'quasar'

import { makeFindAllIterable, polyfillRequestAnimationFrame } from '>/helpers'

polyfillRequestAnimationFrame()

describe('PickupSeriesEdit', () => {
  let localVue
  let wrapper
  let series

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Quasar)
    i18n.locale = 'en'
    series = cloneDeep(pickupSeriesMock[0])
    wrapper = mount(PickupSeriesEdit, {
      localVue,
      i18n,
      propsData: {
        series,
        requestError: jest.fn(),
      },
    })
    makeFindAllIterable(wrapper)
  })

  it('renders', () => {
    expect(wrapper.element.className).toBe('edit')
  })

  it('can toggle the days', () => {
    const labels = [...wrapper.findAll('.q-item-label')]

    const monday = labels.find(label => label.text() === 'Monday')
    const friday = labels.find(label => label.text() === 'Friday')

    monday.trigger('click')
    expect(wrapper.vm.seriesEdit.rule.byDay).toContain('MO')

    friday.trigger('click')
    expect(wrapper.vm.seriesEdit.rule.byDay).toContain('FR')

    monday.trigger('click')
    expect(wrapper.vm.seriesEdit.rule.byDay).not.toContain('MO')
  })

  it('can reset to initial state', () => {
    wrapper.vm.seriesEdit.description = 'changed'
    wrapper.vm.seriesEdit.maxCollectors++
    wrapper.vm.reset()
    expect(wrapper.vm.seriesEdit).toEqual(series)
  })

  it('does not let you remove all days', () => {
    wrapper.vm.seriesEdit.rule.byDay = []
    return Vue.nextTick(() => {
      expect(wrapper.vm.seriesEdit.rule.byDay).toEqual(series.rule.byDay)
    })
  })

  it('detects if you have changed something', () => {
    expect(wrapper.vm.hasChanged).toBe(false)
    wrapper.vm.seriesEdit.maxCollectors++
    expect(wrapper.vm.hasChanged).toBe(true)
    return Vue.nextTick(() => {
      expect(wrapper.hasClass('changed')).toBe(true)
    })
  })

  it('emits a save event with a diff of changes', () => {
    wrapper.vm.seriesEdit.maxCollectors++
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ id: series.id, maxCollectors: series.maxCollectors + 1 })
  })
})
