import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/vue'
import { times } from 'lodash'

import App from '@/App.vue'
import router from '@/router'

import { invalidateQueries, withDefaults } from '>/helpers'
import { createUser, createGroup, loginAs } from '>/mockBackend'
import { acceptApplication } from '>/mockBackend/applications'
import { addUserToGroup } from '>/mockBackend/groups'
import { useMockBackend } from '>/mockBackend/setup'

useMockBackend()

test('join group', async () => {
  const { type, click } = userEvent.setup()
  const user = createUser()
  const group = createGroup()

  // Put a few users in this group, as you can't apply to groups without users
  times(3, () => addUserToGroup(createUser(), group))

  loginAs(user)

  const config = await withDefaults({
    global: { plugins: [router], stubs: { RouterLink: false } },
  })

  const {
    findByText,
    findByRole,
    getByRole,
    findByPlaceholderText,
    queryByText,
  } = render(App, config)

  // We're on the group gallery page with a link to the group :)
  await waitFor(() => {
    expect(router.currentRoute.value.path).toBe('/groupPreview')
  })
  const groupLink = await findByRole('link', { name: group.name })

  // Open the group preview page
  await click(groupLink)

  await waitFor(() => {
    expect(router.currentRoute.value.path).toBe(`/groupPreview/${group.id}`)
  })

  const applyLink = await findByRole('link', { name: 'Apply' })

  // Let's apply!
  await click(applyLink)
  const applicationAnswers = faker.lorem.sentences(2)
  await type(await findByPlaceholderText('Reply to message...'), applicationAnswers)
  await click(getByRole('button', { name: 'Submit' }))

  // Yay \o/
  await findByText('Your application is pending!')

  acceptApplication(user, group)

  await invalidateQueries()

  expect(queryByText('Your application is pending!')).not.toBeInTheDocument()

  // Open the group!
  await click(getByRole('link', { name: 'Open' }))

  // Ooh on the wall page :)
  await waitFor(() => {
    expect(router.currentRoute.value.path).toBe(`/group/${group.id}/wall`)
  })

  // TODO: write a message! (Haven't implemented enough mockBackend to get the conversation yet...)
})
