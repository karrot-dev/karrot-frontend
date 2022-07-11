// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import { storiesOf } from '@storybook/vue'

import KAbout from './KAbout'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

storiesOf('KAbout', module)
  .add('KAbout', () => defaults({
    render: h => h(KAbout),
    store: createDatastore({
      about: {
        getters: {
          deployed: () => ({
            env: 'production',
            date: '2100-02-03',
          }),
        },
      },
    }),
  }))
