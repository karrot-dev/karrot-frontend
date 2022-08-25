import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import { VueQueryPlugin } from 'vue-query'

import { createMockOffersBackend, createOffer } from '@/offers/api/offers.mock'
import { useOfferDetailQuery, useOfferListQuery } from '@/offers/queries'
import { camelizeKeys } from '@/utils/utils'

import { mockAxios } from '>/mockAxios'

describe('offer queries', () => {
  beforeEach(() => jest.resetModules())
  afterEach(() => mockAxios.reset())

  describe('useOfferDetailQuery', () => {
    it('can switch between offers', async () => {
      const offer1 = createOffer()
      const offer2 = createOffer()
      createMockOffersBackend({ offers: [offer1, offer2] })

      const offerId = ref(null)
      const wrapper = mount({
        setup: () => useOfferDetailQuery({ offerId }),
      }, {
        global: { plugins: [VueQueryPlugin] },
      })
      // undefined as id is not set
      await flushPromises()
      expect(wrapper.vm.offer).toBeUndefined()

      // switch to offer1
      offerId.value = offer1.id
      await flushPromises()
      expect(wrapper.vm.offer).toEqual(camelizeKeys(offer1))

      // switch to offer2
      offerId.value = offer2.id
      await flushPromises()
      expect(wrapper.vm.offer).toEqual(camelizeKeys(offer2))

      // and back to nothing again!
      offerId.value = null
      await flushPromises()
      expect(wrapper.vm.offer).toBeUndefined()
    })
  })

  describe('useOfferListQuery', () => {
    it('can filter and paginate', async () => {
      createMockOffersBackend({
        offers: [
          ...Array.from(
            { length: 8 },
            () => createOffer({ status: 'active', group: 1 }),
          ),
          ...Array.from(
            { length: 4 },
            () => createOffer({ status: 'archived', group: 1 }),
          ),
        ],
      }, {
        pageSize: 5,
      })

      const groupId = ref(null)
      const status = ref('active')
      const wrapper = mount({
        setup: () => useOfferListQuery({ groupId, status }),
      }, {
        global: { plugins: [VueQueryPlugin] },
      })

      await flushPromises()

      // nothing as we have no group set
      expect(wrapper.vm.offers).toHaveLength(0)

      groupId.value = 1
      await flushPromises()

      // First page of entries
      expect(wrapper.vm.offers).toHaveLength(5)
      expect(wrapper.vm.hasNextPage).toBe(true)

      // Get next page, to be added to existing ones
      await wrapper.vm.fetchNextPage()
      expect(wrapper.vm.offers).toHaveLength(8)
      expect(wrapper.vm.hasNextPage).toBe(false)

      // should have 4 archived entries
      status.value = 'archived'
      await flushPromises()
      expect(wrapper.vm.offers).toHaveLength(4)
    })
  })
})
