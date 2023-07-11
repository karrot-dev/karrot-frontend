import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/vue'
import { partition, times } from 'lodash'
import { vi } from 'vitest'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import { useMockBackend, createUser, createGroup, createOffer, loginAs, db, setPageSize } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'

import GroupOffers from './GroupOffers.vue'

describe('GroupOffers', () => {
  useMockBackend()

  beforeEach(() => {
    vi.resetModules()
    resetServices()
  })

  beforeEach(() => {
    const user = createUser()
    const group = createGroup()
    addUserToGroup(user, group)
    user.currentGroup = group.id
    setPageSize(3)
    times(8, () => createOffer({ status: 'active', user: user.id, group: group.id }))
    times(4, () => createOffer({ status: 'archived', user: user.id, group: group.id }))
    loginAs(user)
  })

  it('renders a list of active offers', async () => {
    const { findByText, queryByText, queryByTitle } = render(GroupOffers, await withDefaults())

    const [expectedOffers, otherOffers] = partition(db.offers, offer => offer.status === 'active')

    // expect all the active ones to be on the page
    for (const offer of expectedOffers) {
      expect(await findByText(offer.name)).toBeInTheDocument()
    }

    // after all those are done loading, let's check the non-active ones aren't there too
    for (const offer of otherOffers) {
      expect(queryByText(offer.name)).not.toBeInTheDocument()
    }

    // has a "Create offer" button
    expect(queryByTitle('Create offer')).toBeInTheDocument()
  })

  it('can also select archived offers', async () => {
    const { findByText, findByRole, queryByTitle } = render(GroupOffers, await withDefaults())

    // select the archived ones
    await fireEvent.click(await findByRole('combobox'))
    await fireEvent.click(await findByText('My archived offers'))

    // expect all the archived ones to be on the page
    for (const offer of db.offers.filter(offer => offer.status === 'archived')) {
      expect(await findByText(offer.name)).toBeInTheDocument()
    }

    // does not have a Create offer button
    expect(queryByTitle('Create offer')).not.toBeInTheDocument()
  })
})
