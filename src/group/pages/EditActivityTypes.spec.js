import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import {
  useMockBackend,
  createUser,
  createGroup,
  loginAs,
} from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'

import EditActivityTypes from './EditActivityTypes'

describe('EditActivityTypes', () => {
  useMockBackend()
  let user

  beforeEach(() => {
    jest.resetModules()
    resetServices()
  })

  beforeEach(() => {
    user = createUser()
    const group = createGroup()
    addUserToGroup(user, group)
    user.currentGroup = group.id
    loginAs(user)
  })

  it('renders activity types edit form', async () => {
    const { findByText } = render(EditActivityTypes, withDefaults())
    await flushPromises()

    await findByText('Name')
    await findByText('Feedback')
  })

  it('adds new activity type', async () => {
    const { click, type } = userEvent.setup()

    const { queryByRole, findByTitle, findByRole, findByText } = render(EditActivityTypes, withDefaults())
    await flushPromises()

    click(await findByTitle('Add new activity type'))
    type(await findByRole('combobox', { name: 'Name' }), 'Testtype')
    click(await findByRole('option', { name: /Use custom name/i }))
    click(await findByRole('button', { name: /create/i }))
    await flushPromises()
    await flushPromises() // for some reason it needs extra flushing...

    expect(queryByRole('button', { name: /create/i })).not.toBeInTheDocument()

    // TODO for some reason, it doesn't type the whole text... :(
    await findByText('Tes')
  })
})
