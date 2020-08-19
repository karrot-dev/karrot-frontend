import { storiesOf } from '@storybook/vue'

import WallConversation from './WallConversation'
import { currentUserMock } from '>/mockdata'
import { storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const conversation = factories.makeConversation()

const defaultProps = (data) => ({
  data: conversation,
  user: currentUserMock,
  fetchPast: () => {},
  ...data,
})

storiesOf('WallConversation', module)
  .add('default', () => defaults({
    render: h => h(WallConversation, {
      props: defaultProps(),
    }),
  }))
  .add('unread', () => defaults({
    render: h => h(WallConversation, {
      props: defaultProps({
        data: {
          ...conversation,
          unreadMessageCount: 1,
          isParticipant: true,
        },
      }),
    }),
  }))
