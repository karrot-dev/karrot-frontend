import { storiesOf } from '@storybook/vue'

import Conversation from './Conversation'
import { messagesMock, currentUserMock } from '>/mockdata'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

const defaultProps = {
  data: {
    messages: messagesMock,
    sendStatus: statusMocks.default(),
    fetchStatus: statusMocks.default(),
    fetchPastStatus: statusMocks.default(),
    canFetchPast: false,
  },
  user: currentUserMock,
  fetchPast: () => {},
}

storiesOf('Conversation', module)
  .add('Conversation', () => defaults({
    render: h => h(Conversation, {
      props: defaultProps,
    }),
  }))
