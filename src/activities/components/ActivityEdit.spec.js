import { nextTick } from 'vue'

import ActivityEdit from './ActivityEdit'
import { activitiesMock } from '>/mockdata'
import cloneDeep from 'clone-deep'

import { createDatastore, mountWithDefaults, statusMocks } from '>/helpers'

const datastore = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

describe('ActivityEdit', () => {
  beforeEach(() => jest.resetModules())
  let wrapper, activity, unenriched

  beforeEach(() => {
    activity = cloneDeep(activitiesMock[0])
    unenriched = cloneDeep(activitiesMock[0])
    wrapper = mountWithDefaults(ActivityEdit, {
      datastore,
      propsData: { value: activity, status: statusMocks.default() },
    })
  })

  it('renders', () => {
    expect(wrapper.element.className).toBe('edit-box')
  })

  it('can reset to initial state', () => {
    wrapper.vm.edit.description = 'changed'
    wrapper.vm.edit.maxParticipants++
    wrapper.vm.reset()
    expect(wrapper.vm.edit).toEqual(unenriched)
  })

  it('detects if you have changed something', () => {
    expect(wrapper.vm.hasChanged).toBe(false)
    wrapper.vm.edit.maxParticipants++
    expect(wrapper.vm.hasChanged).toBe(true)
    return nextTick().then(() => {
      expect(wrapper.classes()).toContain('changed')
    })
  })

  it('emits a save event with a diff of changes', () => {
    wrapper.vm.edit.maxParticipants++
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ id: activity.id, maxParticipants: activity.maxParticipants + 1 })
  })
})
