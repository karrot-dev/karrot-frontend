import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { test } from 'vitest'

import App from '@/App.vue'
import router from '@/router'

import { withDefaults, invalidateQueries } from '>/helpers'
import { useMockBackend, createUser, createGroup, loginAs } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'

useMockBackend()

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
    getByTestId,
    findByText,
    findByRole,
    findAllByRole,
    findByTitle,
    getByRole,
    findByPlaceholderText,
  } = render(App, await withDefaults({
    global: { plugins: [router], stubs: { RouterLink: false } },
  }))

  // go to members page and select the user
  await click(await findByText('Members'))
  await click(await findByText(otherUser.displayName))

  // click to start a conflict!
  await click(await findByTitle('Start a membership review?'))

  // go through the conflict steps
  await click(await findByRole('button', { name: 'Next' })) // so...
  await click(await findByRole('button', { name: 'Next' })) // ... much ...
  await click(await findByRole('button', { name: 'Next' })) // ... to read

  // fill in the reason and submit!
  const topic = faker.lorem.paragraphs(3)
  await type(getByTestId('topic'), topic)
  await click(getByRole('button', { name: 'Submit' }))

  await findByText('You successfully started a membership review')

  // then we should be on the issues page where we can discuss...
  await waitFor(() => {
    expect(router.currentRoute.value.name).toEqual('issueChat')
  })

  // this gets turned into markdown, so swap newlines for .* regexp...
  const re = new RegExp(topic.split('\n').join('.*'))
  await findByText(re)

  // let's add more thoughts...
  const messageContent = faker.lorem.paragraph(2)
  await type(
    await findByPlaceholderText('Write the first message...'),
    messageContent,
  )
  await click(await findByTitle('Send message'))
  await flushPromises() // need to give it a moment to send, or we refresh before it's actually been submitted

  await invalidateQueries()

  await findByText(messageContent)

  // time to vote!
  await click(await findByRole('tab', { name: 'Vote' }))
  const voteNowButtons = await findAllByRole('button', { name: 'Vote now' })
  const overlayButton = voteNowButtons.find(button => button.type !== 'submit')
  const submitButton = voteNowButtons.find(button => button.type === 'submit')

  await click(overlayButton)
  // TODO: move the sliders a bit...
  // ... the second is the submit button
  await click(submitButton)

  await findByText('Your vote was successfully submitted')
})
