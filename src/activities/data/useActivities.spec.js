jest.mock('@/activities/api/activities')

import api from '@/activities/api/activities'

import VueCompositionAPI, { unref } from '@vue/composition-api'

import { useActivities } from '@/activities/data/useActivities'
import { createLocalVue, enableAutoDestroy, mount } from '@vue/test-utils'
import { send } from '@/activities/data/useEvents'

const localVue = createLocalVue()
localVue.use(VueCompositionAPI)

enableAutoDestroy(afterEach)

describe('useActivities', () => {
  beforeEach(() => {
    api.listFeedbackPossible.mockImplementation(groupId => {
      expect(groupId).toEqual(57)
      return { results: [{ id: 23 }] }
    })
    api.listByGroupId.mockImplementation(groupId => {
      expect(groupId).toEqual(57)
      return { results: [{ id: 32 }] }
    })
  })
  it('fetches activities', async () => {
    const { vm } = mount({
      setup: () => useActivities({ groupId: 57 }),
      render: () => {},
    }, { localVue })
    expect(unref(vm.status.pending)).toEqual(true)
    expect(vm.activities).toEqual([])
    await localVue.nextTick()
    expect(vm.activities).toEqual([{ id: 23 }, { id: 32 }])
  })

  it('receives event updates', async () => {
    const { vm } = mount({
      setup: () => useActivities({ groupId: 57 }),
      render: () => {},
    }, { localVue })
    await localVue.nextTick()
    expect(vm.activities).toEqual([{ id: 23 }, { id: 32 }])
    send('activities:activity', {
      id: 23,
      updated: 'yay',
    })
    await localVue.nextTick()
    expect(vm.activities).toEqual([{ id: 23, updated: 'yay' }, { id: 32 }])
  })
})
