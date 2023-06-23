import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import { render, configure } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { times } from 'lodash'

import App from '@/App'
import router from '@/router'

import { withDefaults } from '>/helpers'
import { useMockBackend, createUser, createGroup, loginAs, db } from '>/mockBackend'
import { addUserToGroup } from '>/mockBackend/groups'

useMockBackend()
jest.setTimeout(60 * 1000) // we do a lot of stuff here, give it some time!

configure({
  asyncUtilTimeout: 2000,
})

test('add a message attachment', async () => {
  const { type, click, upload } = userEvent.setup()

  const user = createUser()
  const group = createGroup()
  addUserToGroup(user, group)

  user.currentGroup = group.id
  loginAs(user)

  const {
    findByTitle,
    findByText,
    findByPlaceholderText,
    findByTestId,
    findAllByTitle,
  } = render(App, withDefaults({
    global: { plugins: [router], stubs: { RouterLink: false } },
  }))

  // should be on the group wall to start with so can just add our message

  const messageContent = faker.lorem.paragraph(2)
  await type(
    await findByPlaceholderText('Write the first message...'),
    messageContent,
  )

  // The hidden input element is only created after we click this
  await click(await findByTitle('Add attachment'))

  const files = times(3).map(() => {
    const mimeType = faker.system.mimeType()
    const ext = faker.system.fileExt(mimeType)
    const filename = faker.system.commonFileName(ext)
    return new File(['(⌐□_□)'], filename, { type: mimeType })
  })

  for (const file of files) {
    // We can't use the file picker directly, so we do next best thing and trigger the file input
    const attachmentInput = await findByTestId('attachment-input')
    await upload(attachmentInput, file)
  }

  await click(await findByTitle('Send message'))
  await flushPromises() // need to give it a moment to send, or we refresh before it's actually been submitted
  await flushPromises()

  // TODO: add mock websockets, for now we need to manually invalidate...
  await require('@/base/queryClient').default.invalidateQueries()

  await findByText(messageContent, {}, { timeout: 2000 })

  // There is an attachment preview thing
  for (const file of files) {
    await findByTitle(file.name)
  }

  // And a download button for each file (can't click it as jsdom doesn't support navigating)
  const downloadButtons = await findAllByTitle('Download')
  expect(downloadButtons).toHaveLength(files.length)

  // TODO: could make sure we have an image as ones of the files, and then click for the carousel
})
