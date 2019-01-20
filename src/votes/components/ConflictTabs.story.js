import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

import ConflictTabs from './ConflictTabs'

const conversation = factories.makeConversation({
  participants: [
    factories.makeUser(),
    factories.makeUser(),
    factories.makeUser(),
  ],
})
const value = null
const votings = [
  factories.makeConflict().votings,
  factories.makeConflict({
    createdAt: '2019-01-02T21:22:54.730980Z',
    isDecided: true,
  }).votings,
  factories.makeConflict({
    createdAt: '2019-01-10T21:22:54.730980Z',
    isDecided: true,
  }).votings,
]
const conflict = factories.makeConflict()

storiesOf('Votes', module)
  .add('conflict', () => defaults({
    render: h => h(ConflictTabs, {
      props: {
        votings,
        conflict,
        conversation,
        value,
      },
    }),
  }))
