import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'

import { resetServices } from '@/utils/datastore/helpers'
import { showToast } from '@/utils/toasts'

import { withDefaults } from '>/helpers'
import {
  useMockBackend,
  createUser,
  createGroup,
  loginAs,
  ctx,
} from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'

import Settings from './Settings.vue'

// somehow showToast can't run Notify.create, possibly a problem with initializing Quasar
// let's just mock it in the meantime
vi.mock('@/utils/toasts')

describe('User Settings', () => {
  useMockBackend()
  let user

  beforeEach(() => {
    vi.resetModules()
    jest.clearAllMocks()
    resetServices()
  })

  beforeEach(() => {
    user = createUser()
    const group = createGroup()
    addUserToGroup(user, group)
    user.currentGroup = group.id
    loginAs(user)
  })

  it('renders settings page', async () => {
    const { findAllByText } = render(Settings, await withDefaults({
      global: { stubs: { Croppa: true } },
    }))
    await flushPromises()

    await findAllByText('Profile')
  })

  it('changes name', async () => {
    const { type, click, clear } = userEvent.setup()

    const { findByTestId, findByRole, findByDisplayValue } = render(Settings, await withDefaults({
      global: { stubs: { Croppa: true } },
    }))
    await flushPromises()

    // set a new name
    const newDisplayName = faker.name.fullName()
    const textbox = await findByRole('textbox', { name: 'Name' })
    await clear(textbox)
    await type(textbox, newDisplayName)

    await click(await findByTestId('save-profile'))
    await flushPromises()

    expect(showToast).toHaveBeenCalled()
    expect(showToast.mock.calls[0][0].message).toBe('NOTIFICATIONS.CHANGES_SAVED')
    await findByDisplayValue(newDisplayName)
  })

  it('changes email', async () => {
    const { type, click, clear } = userEvent.setup()

    const { findByTestId, findByRole } = render(Settings, await withDefaults({
      global: { stubs: { Croppa: true } },
    }))
    await flushPromises()

    // set a new email address
    const newEmail = faker.internet.email()
    const textbox = await findByRole('textbox', { name: 'E-mail' })
    await clear(textbox)
    await type(textbox, newEmail)

    // TODO couldn't make this work with any of the other queries, resorting to testid
    await type(await findByTestId('change-email-confirm-password'), 'nobody knows')

    const submitButton = await findByRole('button', { name: /Change e-mail address/i })
    expect(submitButton).not.toBeDisabled()
    await click(submitButton)
    await flushPromises()

    expect(ctx.authUser.unverifiedEmail).toBe(newEmail)
  })

  it('changes password', async () => {
    const { type, click } = userEvent.setup()

    const { findByRole, findByTestId } = render(Settings, await withDefaults({
      global: { stubs: { Croppa: true } },
    }))
    await flushPromises()

    // set a new password
    const newPassword = faker.internet.password()

    // TODO couldn't make this work with any of the other queries, resorting to testid
    await type(await findByTestId('change-password-new-password'), newPassword)
    await type(await findByTestId('change-password-old-password'), 'nobody knows')
    await flushPromises()

    const submitButton = await findByRole('button', { name: /Change password/i })
    expect(submitButton).not.toBeDisabled()
    await click(submitButton)
    await flushPromises()

    expect(showToast).toHaveBeenCalled()
    expect(showToast.mock.calls[0][0].message).toBe('PASSWORD.CHANGE.SUCCESS')
  })

  it('changes notifications', async () => {
    const { click } = userEvent.setup()

    const { findByText, findByRole } = render(Settings, await withDefaults({
      global: { stubs: { Croppa: true } },
    }))
    await flushPromises()
    await findByRole('checkbox', { name: 'New applications', checked: false })

    // enable another notification type
    await click(await findByText('New applications'))
    await flushPromises()

    expect(showToast).toHaveBeenCalled()
    expect(showToast.mock.calls[0][0].message).toBe('NOTIFICATIONS.CHANGES_SAVED')

    // TODO: add mock websockets, for now we need to manually invalidate...
    await (await import('@/base/queryClient')).default.invalidateQueries()
    await flushPromises()
    await findByRole('checkbox', { name: 'New applications', checked: true })

    // let's disable it again
    await click(await findByText('New applications'))
    await flushPromises()

    expect(showToast).toHaveBeenCalled()
    expect(showToast.mock.calls[0][0].message).toBe('NOTIFICATIONS.CHANGES_SAVED')

    // TODO: add mock websockets, for now we need to manually invalidate...
    await (await import('@/base/queryClient')).default.invalidateQueries()
    await flushPromises()
    await findByRole('checkbox', { name: 'New applications', checked: false })
  })
})
