import Vue from 'vue'

import ActivityEdit from './ActivityEdit'
import { activitiesMock } from '>/mockdata'
import cloneDeep from 'clone-deep'

import { mountWithDefaults, statusMocks } from '>/helpers'

describe('ActivityEdit', () => {
  beforeEach(() => jest.resetModules())
  let wrapper, activity, unenriched

  beforeEach(() => {
    activity = cloneDeep(activitiesMock[0])
    unenriched = cloneDeep(activitiesMock[0])
    wrapper = mountWithDefaults(ActivityEdit, { propsData: { value: activity, status: statusMocks.default() } })
  })

  it('renders', () => {
    expect(wrapper.element.className).toBe('edit-box')
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
    return Vue.nextTick().then(() => {
      expect(wrapper.classes()).toContain('changed')
    })
  })

  it('emits a save event with a diff of changes', () => {
    wrapper.vm.edit.maxCollectors++
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ id: activity.id, maxCollectors: activity.maxCollectors + 1 })
  })
})
