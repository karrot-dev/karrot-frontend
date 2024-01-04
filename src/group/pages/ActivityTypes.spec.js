import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { vi } from 'vitest'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import {
  createUser,
  createGroup,
  createActivityType,
  loginAs,
} from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import { useMockBackend } from '>/mockBackend/setup'
import '>/routerMocks'

import ActivityTypes from './ActivityTypes.vue'

describe('ActivityTypes', () => {
  useMockBackend()
  let group

  beforeEach(() => {
    vi.resetModules()
    resetServices()
  })

  beforeEach(() => {
    const user = createUser()
    group = createGroup()
    addUserToGroup(user, group)
    user.currentGroup = group.id
    loginAs(user)
  })

  it('renders activity types edit form', async () => {
    const {
      findByText,
    } = render(ActivityTypes, await withDefaults())

    await flushPromises()

    await findByText('Name')
    await findByText('Feedback')
  })

  it('adds new activity type', async () => {
    const { click, type } = userEvent.setup()

    const {
      queryByRole,
      findByTitle,
      findByRole,
      findByText,
    } = render(ActivityTypes, await withDefaults())

    await flushPromises()

    await click(await findByTitle('Add new activity type'))
    await flushPromises()
    const textbox = await findByRole('combobox', { name: 'Name' })
    // somehow we need to type the name before we can choose it
    // seems like a problem between jsdom/testing-library and Quasar
    await type(textbox, 'Pickup')
    await click(await findByRole('option', { name: 'Pickup' }))
    await click(await findByRole('button', { name: /create/i }))
    await flushPromises()

    expect(queryByRole('button', { name: /create/i })).not.toBeInTheDocument()

    await findByText('Pickup')
  })

  it('edits activity type name', async () => {
    const activityType = createActivityType({ group: group.id })
    const { click, type, clear } = userEvent.setup()

    const {
      queryByRole,
      findByRole,
      findByText,
      findByTestId,
    } = render(ActivityTypes, await withDefaults())

    await flushPromises()

    await click(await findByText(activityType.name))
    const textbox = await findByRole('combobox', { name: 'Name' })
    await clear(textbox)
    await type(textbox, 'Testtype')
    await click(await findByRole('option', { name: /Use custom name/i }))
    await click(await findByRole('button', { name: /save changes/i }))

    // Now the inner dialog asking to write a message
    await findByText('Confirm changes?')
    await click(await findByTestId('confirmChanges'))

    await flushPromises()

    expect(queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument()

    await findByText('Testtype')
  })
})
