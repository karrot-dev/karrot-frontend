// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import Vue from 'vue'

import * as factories from '>/enrichedFactories'
import { createDatastore } from '>/helpers'

import { QSelect } from 'quasar'

const store = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

describe('ActivitySeriesEdit', () => {
  beforeEach(() => jest.resetModules())
  let wrapper
  let series

  beforeEach(() => {
    series = factories.makeActivitySeries()
    const { mountWithDefaults } = require('>/helpers')
    wrapper = mountWithDefaults(require('./ActivitySeriesEdit').default, {
      store,
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
    const select = wrapper.findComponent(QSelect)

    select.vm.toggleOption('MO')
    expect(wrapper.vm.edit.rule.byDay).toContain('MO')

    select.vm.toggleOption('FR')
    expect(wrapper.vm.edit.rule.byDay).toContain('FR')
  })

  it('can reset to initial state', () => {
    wrapper.vm.edit.description = 'changed'
    wrapper.vm.edit.maxParticipants++
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
    wrapper.vm.edit.maxParticipants++
    expect(wrapper.vm.hasChanged).toBe(true)
    await Vue.nextTick()
    expect(wrapper.classes()).toContain('changed')
  })

  it('emits a save event with a diff of changes', () => {
    wrapper.vm.edit.maxParticipants++
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ id: series.id, maxParticipants: series.maxParticipants + 1 })
  })
})
