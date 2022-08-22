import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { storybookDefaults as defaults } from '>/helpers'

import Banners from './Banners'

storiesOf('Banners', module)
  .add('Banners', () => defaults({
    render: () => h(Banners, {
      banners: [
        {
          type: 'playgroundGroupInfo',
        },
        {
          type: 'notConnected',
          context: { reconnecting: false },
        },
      ],
    }),
  }))
