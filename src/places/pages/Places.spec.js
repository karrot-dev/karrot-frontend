import '@testing-library/jest-dom'
import { render } from '@testing-library/vue'
import { times } from 'lodash'
import { vi } from 'vitest'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import {
  useMockBackend,
  createUser,
  createGroup,
  loginAs,
  createPlace,
  createPlaceType,
} from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'

import Places from './Places.vue'

describe('Places', () => {
  let places
  let placeType
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
    placeType = createPlaceType({ group: group.id })
    places = times(3, () => createPlace({ group: group.id }))
    loginAs(user)
  })

  it('renders a list of places', async () => {
    const { findByText, findAllByText } = render(Places, await withDefaults())

    // place name will be there
    for (const place of places) {
      await findByText(place.name)
    }

    // place type will be there as well
    await findAllByText(placeType.name)
  })
})
