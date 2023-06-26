import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { times } from 'lodash'
import { vi } from 'vitest'

import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults, invalidateQueries } from '>/helpers'
import {
  useMockBackend,
  createUser,
  createGroup,
  createMessage,
  loginAs,
  setPageSize, db,
} from '>/mockBackend'
import { addUserToConversation } from '>/mockBackend/conversations'
import { addUserToGroup } from '>/mockBackend/groups'
import '>/routerMocks'

import WallConversation from './WallConversation.vue'

describe('WallConversation', () => {
  let group
  let messages
  useMockBackend()

  beforeEach(() => {
    vi.resetModules()
    resetServices()
  })

  beforeEach(() => {
    group = createGroup()
    const user = createUser()
    addUserToGroup(user, group)
    user.currentGroup = group.id
    const conversation = db.orm.conversations.get({ type: 'group', targetId: group.id })
    addUserToConversation(user, conversation)
    messages = times(7, () => createMessage({
      author: user.id,
      conversation: conversation.id,
    }))
    setPageSize(3) // make it have to do pagination stuff too...
    loginAs(user)
  })
  it('renders messages', async () => {
    const { findByText } = render(WallConversation, await withDefaults({ props: { groupId: group.id } }))

    // can see all messages
    for (const message of messages) {
      await findByText(message.content)
    }
  })

  it('can send a message', async () => {
    const { type, click } = userEvent.setup()
    const { findByText, findByPlaceholderText, findByTestId } = render(WallConversation, await withDefaults({ props: { groupId: group.id } }))

    await type(
      await findByPlaceholderText('Write a message...'),
      'my new message',
    )
    await click(await findByTestId('send-message'))
    await flushPromises() // shouldn't be necessary, but somehow still makes the test work !?

    // TODO: add mock websockets, for now we need to manually invalidate...
    await invalidateQueries()

    await findByText('my new message')
  })
})
