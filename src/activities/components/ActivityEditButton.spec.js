import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { times } from 'lodash'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import {
  db,
  useMockBackend,
  createUser,
  createGroup,
  loginAs,
  setPageSize,
  createPlace,
  createPlaceType,
  createActivityType,
} from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'

import ActivityEditButton from './ActivityEditButton'

describe('ActivityEditButton', () => {
  let activityType
  let places
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
    setPageSize(3) // make it have to do pagination stuff too...
    createPlaceType({ group: group.id })
    places = times(3, () => createPlace({ group: group.id }))
    activityType = createActivityType({ group: group.id })
    loginAs(user)
  })

  it('creates a new activity', async () => {
    const { click } = userEvent.setup()

    const { findByText, findAllByText, getByText, findByRole, getByRole, getAllByRole } = render(ActivityEditButton, withDefaults())

    await click(getByRole('button', { title: /create/i }))
    await click(getAllByRole('button', { name: activityType.name })[0])

    await click(getByRole('combobox', { name: 'Choose a place' }))
    await click(await findByRole('option', { name: places[0].name }))
    await click(await findByRole('option', { name: places[0].name }))

    expect(db.activities.length).toEqual(0)
    await click(getByRole('button', { name: /create/i }))

    expect(db.activities.length).toEqual(1)
    expect(db.activities[0].place).toEqual(places[0].id)
    expect(db.activities[0].activityType).toEqual(activityType.id)
  })
})
