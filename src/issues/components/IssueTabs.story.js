import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import subHours from 'date-fns/sub_hours'
import addHours from 'date-fns/add_hours'
import * as factories from '>/enrichedFactories'

import IssueTabsUI from './IssueTabsUI'
import IssueVote from './IssueVote'
import VotingResults from './VotingResults'

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

storiesOf('IssueTabs', module)
  .add('singleVoting', () => defaults({
    render: h => h(IssueTabsUI, {
      props: {
        issue,
        conversation,
        value,
      },
    }),
  }))
  .add('vote - furtherDiscussion', () => defaults({
    render: h => h(IssueVote, {
      props: {
        issue: factories.makeIssue({
          createdAt: subHours(new Date(), 2000),
          topic: 'Just some random thought',
          status: 'ongoing',
          votings: [
            factories.makeVoting({
              acceptedOption: null,
              expiresAt: addHours(new Date(), 150),
            }),
            factories.makeVoting({
              acceptedOption: 73,
              expiresAt: subHours(new Date(), 150),
            }),
          ],
        }),
      },
    }),
  }))
  .add('results - expelled', () => defaults({
    render: h => h(VotingResults, {
      props: {
        issue: factories.makeIssue({
          createdAt: addHours(new Date(), 2000),
          topic: 'Such an annoying person, really.',
          status: 'decided',
          votings: [
            factories.makeVoting({
              acceptedOption: 16,
              expiresAt: addHours(new Date(), 150),
              options: [
                factories.makeOption({
                  type: 'remove_user',
                  id: 16,
                  sumScore: 9,
                }),
                factories.makeOption({
                  type: 'further_discussion',
                  sumScore: 3,
                }),
                factories.makeOption({
                  type: 'no_change',
                  sumScore: 0,
                }),
              ],
            }),
          ],
        }),
      },
    }),
  }))
