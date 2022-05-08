import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
import { storybookDefaults as defaults } from '>/helpers'

import Banners from './BannersUI'

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
