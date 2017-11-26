import { storiesOf } from '@storybook/vue'

import Conversation from './Conversation'
import { messagesMock, currentUserMock } from '>/mockdata'
import i18n from '@/i18n'
import router from '@/router'

const defaultProps = {
  data: {
    message: messagesMock,
    sendStatus: { pending: false },
    fetchStatus: { pending: false, hasValidationErrors: false },
    fetchMoreStatus: { pending: false, hasValidationErrors: false },
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
