import { ref } from 'vue'
import { useOfferQuery, useOffersQuery } from '@/offers/queries'
import { flushPromises, mount } from '@vue/test-utils'
import { VueQueryPlugin } from 'vue-query'
import { createOffer, createMockOffersBackend } from '@/offers/api/offers.mock'
import { mockAxios } from '>/mockAxios'
import { camelizeKeys } from '@/utils/utils'

describe('offer queries', () => {
  beforeEach(() => jest.resetModules())
  afterEach(() => mockAxios.reset())

  describe('useOfferQuery', () => {
    it('can switch between offers', async () => {
      const offer1 = createOffer()
      const offer2 = createOffer()
      createMockOffersBackend([offer1, offer2])

      const id = ref(null)
      const wrapper = mount({
        setup: () => useOfferQuery({ id }),
      }, {
        global: { plugins: [VueQueryPlugin] },
      })
      // undefined as id is not set
      await flushPromises()
      expect(wrapper.vm.offer).toBeUndefined()

      // switch to offer1
      id.value = offer1.id
      await flushPromises()
      expect(wrapper.vm.offer).toEqual(camelizeKeys(offer1))

      // switch to offer2
      id.value = offer2.id
      await flushPromises()
      expect(wrapper.vm.offer).toEqual(camelizeKeys(offer2))

      // and back to nothing again!
      id.value = null
      await flushPromises()
      expect(wrapper.vm.offer).toBeUndefined()
    })
  })

  describe('useOffersQuery', () => {
    it('can filter and paginate', async () => {
      createMockOffersBackend([
        ...Array.from(
          { length: 8 },
          () => createOffer({ status: 'active' }),
        ),
        ...Array.from(
          { length: 4 },
          () => createOffer({ status: 'archived' }),
        ),
      ], {
        pageSize: 5,
      })

      const group = ref(null)
      const status = ref('active')
      const wrapper = mount({
        setup: () => useOffersQuery({ group, status }),
      }, {
        global: { plugins: [VueQueryPlugin] },
      })

      await flushPromises()

      // nothing as we have no group set
      expect(wrapper.vm.offers).toHaveLength(0)

      group.value = 1
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
