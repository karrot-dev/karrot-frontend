import { flushPromises, mount } from '@vue/test-utils'
import { times } from 'lodash'

import { createOffer } from '@/offers/api/offers.mock'

import '>/routerMocks'
import { withDefaults } from '>/helpers'
import { createMockBackend, removeMockBackend } from '>/mockBackend'

import GroupOffers from './GroupOffers'

describe('GroupOffers', () => {
  beforeEach(() => {
    createMockBackend(({ currentGroup, offers }) => {
      times(8, () => {
        offers.push(createOffer({ status: 'active', group: currentGroup.id }))
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
