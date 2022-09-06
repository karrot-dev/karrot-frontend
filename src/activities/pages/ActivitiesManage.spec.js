import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { Dialog } from 'quasar'
import { getRouter } from 'vue-router-mock'

import router from '@/router'
import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import {
  useMockBackend,
  createUser,
  createGroup,
  createActivityType,
  createPlace,
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
  let activity
  let activitySeries
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

    activityType = createActivityType({ group: group.id })
    const place = createPlace({ group: group.id })
    activitySeries = createActivitySeries({ place: place.id })
    activity = createActivity({ place: place.id })

    getRouter().setParams({ groupId: group.id, placeId: place.id })
  })

  it('renders activities manage page', async () => {
    const { findByText } = render(ActivitiesManage, withDefaults())
    await flushPromises()

    await findByText('Activity series')
    await findByText('One-time activities')

    await findByText('Tuesday')
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

  it.skip('edits activity series', async () => {
    const { click } = userEvent.setup()

    const { findByText, getByText, getAllByRole, findByRole, getByRole } = render(ActivitiesManage, withDefaults())
    await flushPromises()

    await click(getByText('Tuesday'))
    // now ActivitySeriesEdit is open
    await click(getByRole('combobox', { name: /weekdays/i }))
    // add Wednesday
    await click(await findByText(/Wednesday/i))

    await click(getByRole('button', { name: /save changes/i }))
    await flushPromises()

    // TODO: add mock websockets, for now we need to manually invalidate...
    await require('@/base/queryClient').default.invalidateQueries()

    await findByText('Wednesday')
  })
})
