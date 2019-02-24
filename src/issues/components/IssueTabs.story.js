import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import subHours from 'date-fns/sub_hours'
import addHours from 'date-fns/add_hours'
import * as factories from '>/enrichedFactories'

import IssueVote from './IssueVote'
import VotingResults from './VotingResults'
import IssueHistoryItem from './IssueHistoryItem'

storiesOf('Issues', module)
  .add('history item', () => defaults({
    render: h => h(IssueHistoryItem, {
      props: {
        voting: factories.makeVoting({
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
        affectedUser: factories.makeUser(),
        groupName: 'asdf',
      },
    }),
  }))
  .add('vote - furtherDiscussion', () => defaults({
    render: h => h(IssueVote, {
      props: {
        issue: factories.makeIssue({
          createdAt: subHours(new Date(), 2000),
          topic: 'Just some random thought',
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
        voting: factories.makeVoting({
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
        affectedUser: factories.makeUser(),
        isCancelled: false,
        groupName: 'asdf',
      },
    }),
  }))
