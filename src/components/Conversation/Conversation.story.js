import { storiesOf } from '@storybook/vue'

import Conversation from './Conversation'
import { messagesMock, currentUserMock } from '>/mockdata'
import { statusMocks } from '>/helpers'
import i18n from '@/i18n'
import router from '@/router'

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
  .add('Conversation', () => ({
    render: h => h(Conversation, {
      props: defaultProps,
    }),
    i18n,
    router,
  }))
