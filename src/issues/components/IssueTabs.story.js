import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

import IssueTabs from './IssueTabs'

const conversation = factories.makeConversation({
  participants: [
    factories.makeUser(),
    factories.makeUser(),
    factories.makeUser(),
  ],
})
const value = null
const issue = factories.makeIssue()

storiesOf('Votes', module)
  .add('conflict', () => defaults({
    render: h => h(IssueTabs, {
      props: {
        issue,
        conversation,
        value,
      },
    }),
  }))
