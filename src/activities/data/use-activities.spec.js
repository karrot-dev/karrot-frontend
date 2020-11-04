jest.mock('@/activities/api/activities')

import activitiesAPI from '@/activities/api/activities'

import VueCompositionAPI from '@vue/composition-api'

import { useActivities } from '@/activities/data/useActivities'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(VueCompositionAPI)

describe('useActivities', () => {
  it('works', async () => {
    activitiesAPI.listByGroupId.mockImplementation(groupId => {
      expect(groupId).toEqual(57)
      return {
        results: [{ id: 32 }],
      }
    })
    const { vm } = mount({
      setup: () => useActivities({ groupId: 57 }),
      render: () => {},
    }, { localVue })
    expect(vm.status.pending).toEqual(true)
    expect(vm.activities).toEqual([])
    await vm.status.promise
    expect(vm.activities).toEqual([{ id: 32 }])
  })
})
