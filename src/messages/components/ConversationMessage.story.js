import { storiesOf } from '@storybook/vue'

import ConversationMessage from './ConversationMessage'
import { storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const range = n => [...Array(n).keys()]

const message = factories.makeMessage({
  content: range(50).reduce(acc => acc + 'This is a test. ', ''),
  isEditable: true,
})
const thread = factories.makeThread()

storiesOf('ConversationMessage', module)
  .add('default', () => defaults({
    render: h => h(ConversationMessage, {
      props: {
        message,
      },
    }),
  }))
  .add('edited', () => defaults({
    render: h => h(ConversationMessage, {
      props: {
        message: {
          ...message,
          isEdited: true,
        },
      },
    }),
  }))
  .add('via email', () => defaults({
    render: h => h(ConversationMessage, {
      props: {
        message: {
          ...message,
          receivedVia: 'email',
        },
      },
    }),
  }))
  .add('with replies', () => defaults({
    render: h => h(ConversationMessage, {
      props: {
        message: thread,
      },
    }),
  }))
  .add('slim', () => defaults({
    render: h => h(ConversationMessage, {
      props: {
        message,
        slim: true,
      },
    }),
  }))
