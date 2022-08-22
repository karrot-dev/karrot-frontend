import { flushPromises, mount } from '@vue/test-utils'
import { times } from 'lodash'

import '>/routerMocks'
import { withDefaults } from '>/helpers'
import { useMockBackend, createUser, createGroup, createOffer, loginAs } from '>/mockBackend'
import { addMemberToGroup } from '>/mockBackend/groups'

import GroupOffers from './GroupOffers'

describe('GroupOffers', () => {
  useMockBackend()

  beforeEach(() => jest.resetModules())

  beforeEach(() => {
    const user = createUser()
    const group = createGroup()
    addMemberToGroup(user, group)
    user.currentGroup = group.id
    times(8, () => {
      createOffer({ status: 'active', group: group.id })
    })
    loginAs(user)
  })
  it('has the right number of offers', async () => {
    const wrapper = mount(GroupOffers, withDefaults())
    await flushPromises()
    expect(wrapper.vm.offers).toHaveLength(8)
  })
})
