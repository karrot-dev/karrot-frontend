import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import subHours from 'date-fns/sub_hours'
import * as factories from '>/enrichedFactories'

import IssueTabsUI from './IssueTabsUI'

const conversation = factories.makeConversation({
  participants: [
    factories.makeUser(),
    factories.makeUser(),
    factories.makeUser(),
  ],
})
const value = null
const issue = factories.makeIssue({
  createdAt: subHours(new Date(), 2000),
  topic: 'Just some random thought',
  status: 'decided',
})

storiesOf('Votes', module)
  .add('conflict', () => defaults({
    render: h => h(IssueTabsUI, {
      props: {
        issue,
        conversation,
        value,
      },
    }),
  }))
