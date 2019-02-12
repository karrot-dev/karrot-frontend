import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import { groupsMock } from '>/mockdata'

import ConflictSetupUI from './ConflictSetupUI'

storiesOf('ConflictSetup', module)
  .add('create', () => defaults({
    render: h => h(ConflictSetupUI, {
      props: {
        currentGroup: groupsMock[0],
      },
    }),
  }))
