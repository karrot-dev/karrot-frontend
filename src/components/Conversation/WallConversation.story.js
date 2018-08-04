import { storiesOf } from '@storybook/vue'

import WallConversation from './WallConversation'
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

storiesOf('WallConversation', module)
  .add('WallConversation', () => defaults({
    render: h => h(WallConversation, {
      props: defaultProps,
    }),
  }))
