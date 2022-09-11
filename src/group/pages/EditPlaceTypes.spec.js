import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { Dialog } from 'quasar'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import {
  useMockBackend,
  createUser,
  createGroup,
  createPlaceType,
  loginAs,
} from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'

import EditPlaceTypes from './EditPlaceTypes'

Dialog.create = jest.fn(() => {
  return { onOk (fn) { fn('') } }
})

describe('EditPlaceTypes', () => {
  useMockBackend()
  let group

  beforeEach(() => {
    jest.resetModules()
    resetServices()
  })

  beforeEach(() => {
    const user = createUser()
    group = createGroup()
    addUserToGroup(user, group)
    user.currentGroup = group.id
    loginAs(user)
  })

  it('renders place types edit form', async () => {
    const { findByText } = render(EditPlaceTypes, withDefaults())
    await flushPromises()

    await findByText('Name')
  })

  it('adds new place type', async () => {
    const { click, type } = userEvent.setup()

    const { queryByRole, findByTitle, findByRole, findByText } = render(EditPlaceTypes, withDefaults())
    await flushPromises()

    await click(await findByTitle('Add new place type'))
    const textbox = await findByRole('combobox', { name: 'Name' })
    // somehow we need to type the name before we can choose it
    // seems like a problem between jsdom/testing-library and Quasar
    await type(textbox, 'Distribution Place')
    await click(await findByRole('option', { name: /Distribution Place/i }))
    await click(await findByRole('button', { name: /create/i }))
    await flushPromises()

    expect(queryByRole('button', { name: /create/i })).not.toBeInTheDocument()

    await findByText('Distribution Place')
  })

  it('edits place type name', async () => {
    const placeType = createPlaceType({ group: group.id })
    const { click, type, clear } = userEvent.setup()

    const { queryByRole, findByRole, findByText } = render(EditPlaceTypes, withDefaults())
    await flushPromises()

    await click(await findByText(placeType.name))
    const textbox = await findByRole('combobox', { name: 'Name' })
    await clear(textbox)
    await type(textbox, 'Testtype')
    await click(await findByRole('option', { name: /Use custom name/i }))
    await click(await findByRole('button', { name: /save changes/i }))
    await flushPromises()

    expect(queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument()

    await findByText('Testtype')
  })
})
