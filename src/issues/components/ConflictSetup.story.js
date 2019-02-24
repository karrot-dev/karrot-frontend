import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import { groupsMock } from '>/mockdata'
import * as factories from '>/enrichedFactories'

import ConflictSetup from './ConflictSetup'

storiesOf('ConflictSetup', module)
  .add('create', () => defaults({
    render: h => h(ConflictSetup, {
      props: {
        currentGroup: groupsMock[0],
        user: factories.makeUser(),
      },
    }),
  }))
