import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { times } from 'lodash'

import App from '@/App.vue'
import router from '@/router'

import { invalidateQueries, withDefaults } from '>/helpers'
import { useMockBackend, createUser, createGroup, loginAs } from '>/mockBackend'
import { acceptApplication } from '>/mockBackend/applications'
import { addUserToGroup } from '>/mockBackend/groups'

useMockBackend()

test('join group', async () => {
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

  // We're on the group preview page with a link to the group :)
  const groupLink = await findByRole('link', { name: group.name })
  await waitFor(() => {
    expect(router.currentRoute.value.path).toBe('/groupPreview')
  })

  // Open the group preview page
  await fireEvent.click(groupLink)

  const applyLink = await findByRole('link', { name: 'Apply' })
  await waitFor(() => {
    expect(router.currentRoute.value.path).toBe(`/groupPreview/${group.id}`)
  })

  // Let's apply!
  await fireEvent.click(applyLink)
  const applicationAnswers = faker.lorem.paragraphs(2)
  await fireEvent.update(await findByPlaceholderText('Reply to message...'), applicationAnswers)
  await fireEvent.submit(getByRole('button', { name: 'Submit' }))

  // Yay \o/
  await findByText('Your application is pending!')

  acceptApplication(user, group)

  await invalidateQueries()

  expect(queryByText('Your application is pending!')).not.toBeInTheDocument()

  // Open the group!
  await fireEvent.click(getByRole('link', { name: 'Open' }))

  // Ooh on the wall page :)
  await waitFor(() => {
    expect(router.currentRoute.value.path).toBe(`/group/${group.id}/wall`)
  })

  // TODO: write a message! (Haven't implemented enough mockBackend to get the conversation yet...)
})
