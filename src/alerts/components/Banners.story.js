<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
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
