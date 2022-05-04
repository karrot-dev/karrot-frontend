import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'

import ConversationCompose from './ConversationCompose'
import { createDatastore, storybookDefaults as defaults, statusMocks } from '>/helpers'
import * as factories from '>/enrichedFactories'

const user = factories.makeCurrentUser()

function createStore () {
  return createDatastore({
    users: {
      getters: {
        byCurrentGroup: () => [],
      },
    },
  })
}

storiesOf('ConversationCompose', module)
  .add('default', () => defaults({
    store: createStore(),
    render: () => h(ConversationCompose, {
      placeholder: 'Type here',
      user,
      status: statusMocks.default(),
    }),
  }))
  .add('edit', () => defaults({
    store: createStore(),
    render: () => h(ConversationCompose, {
      placeholder: 'Type here',
      user,
      value: { content: 'existing text', images: [] },
      status: statusMocks.default(),
    }),
  }))
  .add('not participant', () => defaults({
    store: createStore(),
    render: () => h(ConversationCompose, {
      placeholder: 'Type here',
      user,
      isParticipant: false,
      status: statusMocks.default(),
    }),
  }))
  .add('slim', () => defaults({
    store: createStore(),
    render: () => h(ConversationCompose, {
      placeholder: 'Type here',
      user,
      slim: true,
      status: statusMocks.default(),
    }),
  }))
  .add('pending', () => defaults({
    store: createStore(),
    render: () => h(ConversationCompose, {
      placeholder: 'Type here',
      user,
      status: statusMocks.pending(),
    }),
  }))
  .add('error', () => defaults({
    store: createStore(),
    render: () => h(ConversationCompose, {
      placeholder: 'Type here',
      user,
      status: statusMocks.validationError('content', 'too late!'),
    }),
  }))
