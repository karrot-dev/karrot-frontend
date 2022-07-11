// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
            context: { reconnecting: false },
          },
        ],
      },
    }),
  }))
