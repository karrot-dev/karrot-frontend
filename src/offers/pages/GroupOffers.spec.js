import { flushPromises, mount } from '@vue/test-utils'
import { times } from 'lodash'

import { createAuthUser } from '@/authuser/api/authUser.mock'
import { createGroupDetail } from '@/group/api/groups.mock'
import { createOffer } from '@/offers/api/offers.mock'

import '>/routerMocks'
import { withDefaults } from '>/helpers'
import { createMockBackend, removeMockBackend } from '>/mockBackend'

import GroupOffers from './GroupOffers'

describe('GroupOffers', () => {
  beforeEach(() => {
    createMockBackend(({ db }) => {
      db.authUser = createAuthUser()
      const currentGroup = createGroupDetail({ members: [db.authUser] })
      db.groups.push(currentGroup)
      db.authUser.current_group = currentGroup.id
      times(8, () => {
        db.offers.push(createOffer({ status: 'active', group: currentGroup.id }))
      })
    })
  })
  afterEach(() => removeMockBackend())
  it('has the right number of offers', async () => {
    const wrapper = mount(GroupOffers, withDefaults())
    await flushPromises()
    expect(wrapper.vm.offers).toHaveLength(8)
  })
})
