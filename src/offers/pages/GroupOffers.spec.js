import { flushPromises, mount } from '@vue/test-utils'
import { createStore } from 'vuex'

import { createMockOffersBackend, createOffer } from '@/offers/api/offers.mock'

import { withDefaults } from '>/helpers'
import '>/routerMocks'

import GroupOffers from './GroupOffers'

describe('GroupOffers', () => {
  it('works', async () => {
    createMockOffersBackend(Array.from(
      { length: 8 },
      () => createOffer({ status: 'active' }),
    ))
    const wrapper = mount(GroupOffers, withDefaults({
      global: {
        plugins: [
          createStore({
            modules: {
              users: {
                namespaced: true,
                getters: {
                  get: () => () => null,
                },
              },
              currentGroup: {
                namespaced: true,
                getters: {
                  id: () => 1,
                },
              },
            },
          }),
        ],
      },
    }))
    await flushPromises()
    expect(wrapper.vm.offers).toHaveLength(8)
  })
})
