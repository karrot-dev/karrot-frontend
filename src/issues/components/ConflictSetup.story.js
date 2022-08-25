import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import * as factories from '>/enrichedFactories'
import { storybookDefaults as defaults } from '>/helpers'
import { groupsMock } from '>/mockdata'

import ConflictSetup from './ConflictSetup'

storiesOf('ConflictSetup', module)
  .add('create', () => defaults({
    render: () => h(ConflictSetup, {
      currentGroup: groupsMock[0],
      user: factories.makeUser(),
    }),
  }))
