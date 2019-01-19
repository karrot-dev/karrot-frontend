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
const conflicts = [
  factories.makeConflict(),
  factories.makeConflict({
    createdAt: '2019-01-02T21:22:54.730980Z',
    isDecided: true,
  }),
  factories.makeConflict({
    createdAt: '2019-01-10T21:22:54.730980Z',
    isDecided: true,
  }),
]
const conflict = factories.makeConflict()
const history = [
  factories.makeHistory({
    typus: 'PICKUP_MISSED',
  }),
  factories.makeHistory(),
  factories.makeHistory(),
  factories.makeHistory(),
]

storiesOf('Votes', module)
  .add('conflict', () => defaults({
    render: h => h(ConflictTabs, {
      props: {
        conflicts,
        conflict,
        conversation,
        value,
        history,
      },
    }),
  }))
