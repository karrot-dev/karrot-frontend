// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue3'

import AddressPicker from './AddressPicker'

storiesOf('AddressPicker', module)
  .add('Default', () => defaults({
    components: { AddressPicker },
    template: '<AddressPicker v-model="item" />',
    data () {
      return {
        item: {
          address: '',
          latitude: '',
          longitude: '',
        },
      }
    },
  }))
