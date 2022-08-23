import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import { fireEvent, render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import { useMockBackend, createUser, createGroup, loginAs } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'

import GroupOffers from './GroupOffers'
import OfferCreate from './OfferCreate'

describe('OfferCreate', () => {
  useMockBackend()

  beforeEach(() => {
    jest.resetModules()
    resetServices()
  })

  beforeEach(() => {
    const user = createUser()
    const group = createGroup()
    addUserToGroup(user, group)
    user.currentGroup = group.id
    loginAs(user)
  })

  it('can create an offer and see it listed', async () => {
    const { getByLabelText, getByRole, unmount } = render(OfferCreate, withDefaults({
      global: {
        stubs: {
          // Stub Croppa as it doesn't seem to work otherwise...
          // TODO: maybe could work if enabled configureCompat mode for testing?
          Croppa: true,
        },
      },
    }))
    await flushPromises()
    const offerParams = {
      name: faker.random.words(5),
      description: faker.lorem.paragraphs(2),
    }
    await fireEvent.update(getByLabelText('Name'), offerParams.name)
    await fireEvent.update(getByLabelText('Description', { selector: 'textarea' }), offerParams.description)
    await fireEvent.click(getByRole('button', { name: /create/i }))

    // let's load the offers page and see if it's there!

    unmount() // get rid of the create form first...

    const { findByText } = render(GroupOffers, withDefaults())
    expect(await findByText(offerParams.name)).toBeInTheDocument()
  })
})
