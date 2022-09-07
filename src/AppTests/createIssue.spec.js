import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import { render, configure } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'

import App from '@/App'
import router from '@/router'

import { withDefaults } from '>/helpers'
import { useMockBackend, createUser, createGroup, loginAs } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'

useMockBackend()
jest.setTimeout(60 * 1000) // we do a lot of stuff here, give it some time!

configure({
  asyncUtilTimeout: 2000,
})

test('create issue', async () => {
  const { type, click } = userEvent.setup()

  const user = createUser()
  const group = createGroup()
  addUserToGroup(user, group)

  const otherUser = createUser()
  addUserToGroup(otherUser, group)

  user.currentGroup = group.id
  loginAs(user)

  const {
    getByText,
    getByTestId,
    findByText,
    findByRole,
    findByTitle,
    findByTestId,
    getByRole,
    findByPlaceholderText,
  } = render(App, withDefaults({
    global: { plugins: [router], stubs: { RouterLink: false } },
  }))

  // go to members page and select the user
  await click(await findByRole('link', { name: 'Members' }))
  await click(await findByText(otherUser.displayName))

  // click to start a conflict!
  await click(await findByTitle(`Is there a conflict with ${otherUser.displayName}?`))

  // go through the conflict steps
  await click(await findByRole('button', { name: 'Next' })) // so...
  await click(await findByRole('button', { name: 'Next' })) // ... much ...
  await click(await findByRole('button', { name: 'Next' })) // ... to read

  // fill in the reason and submit!
  const topic = faker.lorem.paragraphs(3)
  await type(getByTestId('topic'), topic)
  await click(getByRole('button', { name: 'Submit' }))

  await findByText('You successfully started a conflict resolution process')

  // then we should be on the issues page where we can discuss...
  expect(router.currentRoute.value.name).toEqual('issueChat')

  // this gets turned into markdown, so swap newlines for .* regexp...
  const re = new RegExp(topic.split('\n').join('.*'))
  expect(getByText(re)).toBeInTheDocument()

  // let's add more thoughts...
  const messageContent = faker.lorem.paragraph(2)
  await type(
    await findByPlaceholderText('Write the first message...'),
    messageContent,
  )
  await click(await findByTestId('send-message'))
  await flushPromises() // need to give it a moment to send, or we refresh before it's actually been submitted

  // TODO: add mock websockets, for now we need to manually invalidate...
  await require('@/base/queryClient').default.invalidateQueries()
  await flushPromises()

  await findByText(messageContent)

  // time to vote!
  await click(await findByRole('tab', { name: 'Vote' }))
  await click(await findByRole('button', { name: 'Vote now' }))
  // TODO: move the sliders a bit...
  await click(await findByRole('button', { name: 'Save' }))

  await findByText('Your vote was successfully submitted')
})
