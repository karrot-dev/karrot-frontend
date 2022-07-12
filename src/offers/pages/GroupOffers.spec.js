import { flushPromises, mount } from '@vue/test-utils'
import GroupOffers from './GroupOffers'
import { VueQueryPlugin } from 'vue-query'
import { Quasar } from 'quasar'
import { i18nPlugin } from '@/base/i18n'
import '>/routerMocks'
import { createMockOffersBackend, createOffer } from '@/offers/api/offers.mock'
import quasarConfig from '>/quasarConfig'
import { createStore } from 'vuex'

describe('GroupOffers', () => {
  it('works', async () => {
    createMockOffersBackend(Array.from(
      { length: 8 },
      () => createOffer({ status: 'active' }),
    ))
    // TODO: see how this compares with mountWithDefaults...
    const wrapper = mount(GroupOffers, {
      global: {
        plugins: [
          [Quasar, quasarConfig],
          i18nPlugin,
          VueQueryPlugin,
          createStore({
            modules: {
              currentGroup: {
                namespaced: true,
                getters: {
                  id: () => 1,
                },
              },
            },
          }),
        ],
        directives: {
          measure: {},
        },
      },
    })
    await flushPromises()
    expect(wrapper.vm.offers).toHaveLength(8)
  })
})
