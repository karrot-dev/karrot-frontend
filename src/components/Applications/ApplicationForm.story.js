import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import { groupsMock } from '>/mockdata'

import ApplicationFormUI from './ApplicationFormUI'

storiesOf('ApplicationForm', module)
  .add('create', () => defaults({
    render: h => h(ApplicationFormUI, {
      props: {
        group: groupsMock[0],
      },
    }),
  }))
