import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/vue'
import { times } from 'lodash'

import App from '@/App.vue'
import router from '@/router'

import { withDefaults } from '>/helpers'
import { createGroup, createUser, db, useMockBackend } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'

useMockBackend()

test('browse the site whilst logged out', async () => {
  const users = times(3, () => createUser())
  times(4, () => {
    const group = createGroup()
    for (const user of users) {
      addUserToGroup(user, group)
    }
  })

  const { findByText, findAllByRole } = render(App, await withDefaults({
    global: { plugins: [router], stubs: { RouterLink: false } },
  }))

  // the nice welcome page text is visible
  expect(await findByText(
    /Karrot is a free and open-source tool for grassroots initiatives/,
  )).toBeInTheDocument()

  // the groups are listed
  for (const group of db.groups) {
    expect(await findByText(group.name)).toBeInTheDocument()
  }

  // we have some handy buttons
  await findAllByRole('button', { name: 'Sign Up!' })
  await findAllByRole('button', { name: 'Browse existing groups' })

  // visit a group
  const group = db.groups[0]
  await fireEvent.click(await findByText(group.name))

  await findByText('Log in or sign up to join this group!')
})
