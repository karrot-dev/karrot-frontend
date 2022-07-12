import { ref } from 'vue'
import { useOffersQuery } from '@/offers/queries'
import { flushPromises, mount } from '@vue/test-utils'
import { VueQueryPlugin } from 'vue-query'
import { createOffer, createMockOffersBackend } from '@/offers/api/offers.mock'
import { mockAxios } from '>/mockAxios'

describe('Offers Query', () => {
  beforeEach(() => jest.resetModules())
  afterEach(() => mockAxios.restore())

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
