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
const conflict = factories.makeConflict()

storiesOf('Votes', module)
  .add('conflict', () => defaults({
    render: h => h(ConflictTabs, {
      props: {
        conflict,
        conversation,
        value,
      },
    }),
  }))
