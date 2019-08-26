import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'

import Banners from './BannersUI'

storiesOf('Banners', module)
  .add('Banners', () => defaults({
    render: h => h(Banners, {
      props: {
        banners: [
          {
            type: 'playgroundGroupInfo',
          },
          {
            type: 'notConnected',
          },
        ],
      },
    }),
  }))
