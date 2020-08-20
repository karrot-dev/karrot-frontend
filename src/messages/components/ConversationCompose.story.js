import { storiesOf } from '@storybook/vue'

import ConversationCompose from './ConversationCompose'
import { storybookDefaults as defaults, statusMocks } from '>/helpers'
import * as factories from '>/enrichedFactories'

const user = factories.makeCurrentUser()

storiesOf('ConversationCompose', module)
  .add('default', () => defaults({
    render: h => h(ConversationCompose, {
      props: {
        placeholder: 'Type here',
        user,
        status: statusMocks.default(),
      },
    }),
  }))
  .add('edit', () => defaults({
    render: h => h(ConversationCompose, {
      props: {
        placeholder: 'Type here',
        user,
        value: { content: 'existing text', images: [] },
        status: statusMocks.default(),
      },
    }),
  }))
  .add('not participant', () => defaults({
    render: h => h(ConversationCompose, {
      props: {
        placeholder: 'Type here',
        user,
        isParticipant: false,
        status: statusMocks.default(),
      },
    }),
  }))
  .add('slim', () => defaults({
    render: h => h(ConversationCompose, {
      props: {
        placeholder: 'Type here',
        user,
        slim: true,
        status: statusMocks.default(),
      },
    }),
  }))
  .add('pending', () => defaults({
    render: h => h(ConversationCompose, {
      props: {
        placeholder: 'Type here',
        user,
        status: statusMocks.pending(),
      },
    }),
  }))
  .add('error', () => defaults({
    render: h => h(ConversationCompose, {
      props: {
        placeholder: 'Type here',
        user,
        status: statusMocks.validationError('content', 'too late!'),
      },
    }),
  }))
