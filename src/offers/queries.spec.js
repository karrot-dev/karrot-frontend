import { faker } from '@faker-js/faker'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { waitFor } from '@testing-library/vue'
import { flushPromises, mount } from '@vue/test-utils'
import { times } from 'lodash'
import { ref } from 'vue'

import { useOfferDetailQuery, useOfferListQuery } from '@/offers/queries'

import { createOffer, setPageSize, createUser, createGroup, loginAs } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import { toOfferResponse } from '>/mockBackend/offers'
import { useMockBackend } from '>/mockBackend/setup'

describe('offer queries', () => {
  useMockBackend()

  describe('useOfferDetailQuery', () => {
    it('can switch between offers', async () => {
      const group = createGroup()
      const user = createUser()
      addUserToGroup(user, group)
      loginAs(user)
      const offer1 = createOffer({ user: user.id, group: group.id })
      const offer2 = createOffer({ user: user.id, group: group.id })

      const offerId = ref(null)
      const wrapper = mount({
        setup: () => useOfferDetailQuery({ offerId }),
        render () {}, // don't need to render anything, avoids warning
      }, {
        global: { plugins: [VueQueryPlugin] },
      })
      // undefined as id is not set
      await waitFor(() => {
        expect(wrapper.vm.offer).toBeUndefined()
      })

      // switch to offer1
      offerId.value = offer1.id
      await waitFor(() => {
        expect(wrapper.vm.offer).toEqual(toOfferResponse(offer1))
      })

      // switch to offer2
      offerId.value = offer2.id
      await waitFor(() => {
        expect(wrapper.vm.offer).toEqual(toOfferResponse(offer2))
      })

      // and back to nothing again!
      offerId.value = null
      await waitFor(() => {
        expect(wrapper.vm.offer).toBeUndefined()
      })
    })
  })

  describe('useOfferListQuery', () => {
    it('can filter and paginate', async () => {
      const group = createGroup()
      const user = createUser()
      addUserToGroup(user, group)
      loginAs(user)
      setPageSize(5) // TODO: better to pass it as param to query/API
      times(8, () => createOffer({ archivedAt: null, user: user.id, group: group.id }))
      times(4, () => createOffer({ archivedAt: faker.date.past(), user: user.id, group: group.id }))

      const groupId = ref(null)
      const isArchived = ref(false)
      const wrapper = mount({
        setup: () => useOfferListQuery({ groupId, isArchived }),
        render () {}, // don't need to render anything, avoids warning
      }, {
        global: { plugins: [VueQueryPlugin] },
      })

      await flushPromises()

      // nothing as we have no group set
      expect(wrapper.vm.offers).toHaveLength(0)

      groupId.value = group.id
      await flushPromises()

      // First page of entries
      expect(wrapper.vm.offers).toHaveLength(5)
      expect(wrapper.vm.hasNextPage).toBe(true)

      // Get next page, to be added to existing ones
      await wrapper.vm.fetchNextPage()
      expect(wrapper.vm.offers).toHaveLength(8)
      expect(wrapper.vm.hasNextPage).toBe(false)

      // should have 4 archived entries
      isArchived.value = true
      await flushPromises()
      expect(wrapper.vm.offers).toHaveLength(4)
    })
  })
})
