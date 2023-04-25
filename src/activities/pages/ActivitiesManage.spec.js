import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { Dialog } from 'quasar'
import { getRouter } from 'vue-router-mock'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import {
  useMockBackend,
  createUser,
  createGroup,
  createActivityType,
  createPlace,
  createPlaceType,
  createActivity,
  createActivitySeries,
  loginAs,
} from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'

import ActivitiesManage from './ActivitiesManage'

Dialog.create = jest.fn(() => {
  return { onOk (fn) { fn('') } }
})

describe('ActivitiesManage', () => {
  useMockBackend()
  let activityType

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

    createPlaceType({ group: group.id })

    activityType = createActivityType({ group: group.id })
    const place = createPlace({ group: group.id })
    createActivitySeries({ place: place.id })
    createActivity({ place: place.id })

    getRouter().setParams({ groupId: group.id, placeId: place.id })
  })

  it('renders activities manage page', async () => {
    const { findByText } = render(ActivitiesManage, withDefaults())
    await flushPromises()

    await findByText('Activity series')
    await findByText('One-time activities')

    await findByText('Tuesday')
    await findByText('10:00 AM')
  })

  it('creates activity series', async () => {
    const { click } = userEvent.setup()

    const { findByText, getAllByRole, getByRole } = render(ActivitiesManage, withDefaults())
    await flushPromises()

    await click(getAllByRole('button')[0]) // the first big plus button, hard to match more specific
    await click(getAllByRole('button', { name: activityType.name })[0])

    // now ActivitySeriesEdit is open
    await findByText('Frequency')
    // we just accept the default
    await click(getByRole('button', { name: /create/i }))
    await flushPromises()

    // TODO: add mock websockets, for now we need to manually invalidate...
    await require('@/base/queryClient').default.invalidateQueries()

    await findByText('Monday')
  })

  it('edits activity series', async () => {
    const { click } = userEvent.setup()

    const { queryByRole, findAllByText, getByText, getByRole, findByRole } = render(ActivitiesManage, withDefaults())
    await flushPromises()

    expect(queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument()

    await click(getByText('Tuesday'))
    // now ActivitySeriesEdit is open
    await click(getByRole('combobox', { name: /weekdays/i }))
    // add Wednesday
    // somehow we need to click two times to activate the option
    await click(await findByRole('option', { name: 'Wednesday' }))

    await click(getByRole('button', { name: /save changes/i }))

    // TODO: add mock websockets, for now we need to manually invalidate...
    await require('@/base/queryClient').default.invalidateQueries()
    await flushPromises()

    expect(queryByRole('button', { name: /save changes/i })).toBeDisabled()

    await findAllByText('Tuesday, Wednesday')
  })
})
