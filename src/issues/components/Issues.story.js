import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults, statusMocks } from '>/helpers'
import subHours from 'date-fns/sub_hours'
import addHours from 'date-fns/add_hours'
import * as factories from '>/enrichedFactories'

import IssueVote from './IssueVote'
import VotingResults from './VotingResults'
import IssueHistoryItem from './IssueHistoryItem'
import IssueList from './IssueListUI'

const range = n => [...Array(n).keys()]

const user = factories.makeUser()
const votingRemoveUser = factories.makeVoting({
  acceptedOption: 16,
  expiresAt: subHours(new Date(), 150),
  options: [
    factories.makeOption({
      type: 'remove_user',
      id: 16,
      meanScore: 1.4,
      sumScore: 2,
    }),
    factories.makeOption({
      type: 'further_discussion',
      meanScore: 0.4,
      sumScore: 1,
    }),
    factories.makeOption({
      type: 'no_change',
      meanScore: 0,
      sumScore: 0,
    }),
  ],
})
const issueFurtherDiscussion = factories.makeIssue({
  createdAt: subHours(new Date(), 2000),
  topic: 'Just some random thought',
  votings: [
    factories.makeVoting({
      acceptedOption: null,
      createdAt: subHours(new Date(), 150),
      expiresAt: addHours(new Date(), 150),
    }),
    factories.makeVoting({
      acceptedOption: 73,
      expiresAt: subHours(new Date(), 150),
      options: [
        factories.makeOption({
          type: 'remove_user',
          meanScore: 0,
          sumScore: 0,
        }),
        factories.makeOption({
          type: 'further_discussion',
          meanScore: 0.4,
          sumScore: 1,
        }),
        factories.makeOption({
          id: 73,
          type: 'no_change',
          meanScore: 1.4,
          sumScore: 2,
        }),
      ],
    }),
  ],
})

const issueNoVote = factories.makeIssue({
  createdAt: subHours(new Date(), 2000),
  topic: 'Just some random thought',
  votings: [
    factories.makeVoting({
      acceptedOption: null,
      createdAt: subHours(new Date(), 150),
      expiresAt: addHours(new Date(), 150),
      options: [
        factories.makeOption({
          type: 'remove_user',
          yourScore: null,
        }),
        factories.makeOption({
          type: 'further_discussion',
          yourScore: null,
        }),
        factories.makeOption({
          type: 'no_change',
          yourScore: null,
        }),
      ],
    }),
  ],
})

const ongoingIssues = range(3).map(() => factories.makeIssue({
  createdAt: subHours(new Date(), 2 * 24),
  votings: [
    factories.makeVoting({
      acceptedOption: null,
      createdAt: subHours(new Date(), 2 * 24),
      expiresAt: addHours(new Date(), 3 * 24),
    }),
  ],
}))

const pastIssues = range(4).map(() => factories.makeIssue({
  createdAt: subHours(new Date(), 7 * 24),
  votings: [
    votingRemoveUser,
  ],
}))

storiesOf('Issues', module)
  .add('history item', () => defaults({
    render: h => h(IssueHistoryItem, {
      props: {
        voting: votingRemoveUser,
        affectedUser: user,
        groupName: 'asdf',
      },
    }),
  }))
  .add('IssueVote - vote', () => defaults({
    render: h => h(IssueVote, {
      props: {
        issue: issueFurtherDiscussion,
      },
    }),
  }))
  .add('IssueVote - not voted yet', () => defaults({
    render: h => h(IssueVote, {
      props: {
        issue: issueNoVote,
      },
    }),
  }))
  .add('results - expelled', () => defaults({
    render: h => h(VotingResults, {
      props: {
        voting: votingRemoveUser,
        affectedUser: user,
        isCancelled: false,
        groupName: 'asdf',
      },
    }),
  }))
  .add('IssueList', () => defaults({
    render: h => h(IssueList, {
      props: {
        ongoingIssues,
        pastIssues,
        status: statusMocks.default(),
      },
    }),
  }))
