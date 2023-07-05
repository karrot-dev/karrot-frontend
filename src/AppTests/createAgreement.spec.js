import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/vue'
import { test } from 'vitest'

import App from '@/App.vue'
import router from '@/router'

import { withDefaults } from '>/helpers'
import { useMockBackend, createUser, createGroup, loginAs, db } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'

useMockBackend()

test('create an agreement', async () => {
  const { type, click } = userEvent.setup()

  const user = createUser()
  const group = createGroup({ features: ['agreements'] })
  addUserToGroup(user, group)

  const otherUser = createUser()
  addUserToGroup(otherUser, group)

  user.currentGroup = group.id
  loginAs(user)

  const {
    getByText,
    findByText,
    findAllByText,
    findByRole,
    findByTitle,
  } = render(App, await withDefaults({
    global: { plugins: [router], stubs: { RouterLink: false } },
  }))

  // go to agreements page and click to make a new one
  await click(await findByText('Agreements'))
  await click(await findByTitle('Create'))

  const title = faker.lorem.words(5)
  const summary = faker.lorem.paragraph()
  const content = faker.lorem.paragraphs(10)

  // fill in the form
  await type(await findByRole('textbox', { name: 'Agreement Title' }), title)
  await type(await findByRole('textbox', { name: 'Summary (optional)' }), summary)
  await type(await findByRole('textbox', { name: 'Agreement Text' }), content)
  await click(await findByRole('button', { name: 'Create' }))

  // see it on the page!
  // (using the All variant as it appears twice... (breadcrumbs, and body)
  await findAllByText(title)
  await findByText(summary)
  // this gets turned into markdown, so swap newlines for .* regexp...
  const re = new RegExp(content.split('\n').join('.*'))
  await findByText(re)

  await waitFor(() => {
    expect(router.currentRoute.value.name).toBe('agreement')
  })

  // make sure the data ended up in the db
  const agreement = db.agreements[0]
  expect(agreement.title).toEqual(title)
  expect(agreement.summary).toEqual(summary)
  expect(agreement.content).toEqual(content)

  // shows it's active
  expect(getByText('Active')).toBeInTheDocument()

  // has history view
  expect(getByText('agreement created')).toBeInTheDocument()
})
