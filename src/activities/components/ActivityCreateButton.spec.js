import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { times } from 'lodash'
import { vi } from 'vitest'

import { resetServices } from '@/utils/datastore/helpers'
import { showToast } from '@/utils/toasts'

import { withDefaults } from '>/helpers'
import {
  createUser,
  createGroup,
  loginAs,
  setPageSize,
  createPlace,
  createPlaceType,
  createActivityType, getMockBackendDatabase,
} from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'
import { useMockBackend } from '>/mockBackend/setup'

import ActivityCreateButton from './ActivityCreateButton.vue'

// somehow showToast can't run Notify.create, possibly a problem with initializing Quasar
// let's just mock it in the meantime
vi.mock('@/utils/toasts')

describe('ActivityCreateButton', () => {
  let activityType
  let places
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
    setPageSize(3) // make it have to do pagination stuff too...
    createPlaceType({ group: group.id })
    places = times(3, () => createPlace({ group: group.id }))
    activityType = createActivityType({ group: group.id })
    loginAs(user)
  })

  it('creates a new activity', async () => {
    const { click } = userEvent.setup()

    const {
      findByRole,
      getByRole,
      getAllByRole,
    } = render(ActivityCreateButton, await withDefaults())

    await click(getByRole('button', { title: /create/i }))
    await click(getAllByRole('button', { name: activityType.name })[0])

    await click(getByRole('combobox', { name: 'Choose a place' }))
    await click(await findByRole('option', { name: places[0].name }))

    const db = getMockBackendDatabase()

    expect(db.activities.length).toBe(0)
    await click(getByRole('button', { name: 'Create' }))
    await flushPromises()
    await flushPromises() // shouldn't be necessary, but somehow still makes the test work !?

    expect(db.activities.length).toBe(1)
    expect(db.activities[0].place).toEqual(places[0].id)
    expect(db.activities[0].activityType).toEqual(activityType.id)
    expect(showToast).toHaveBeenCalled()
  })
})
