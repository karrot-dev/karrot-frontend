import { storiesOf } from '@storybook/vue'

import Conversation from './Conversation'
import { messagesMock, currentUserMock } from '>/mockdata'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

const defaultProps = {
  data: {
    messages: messagesMock,
    sendStatus: statusMocks.default(),
    fetchStatus: statusMocks.default(),
    fetchMoreStatus: statusMocks.default(),
    canLoadMore: false,
  },
  user: currentUserMock,
  fetchMore: () => {},
}

storiesOf('Conversation', module)
  .add('Conversation', () => defaults({
    render: h => h(Conversation, {
      props: defaultProps,
    }),
  }))
