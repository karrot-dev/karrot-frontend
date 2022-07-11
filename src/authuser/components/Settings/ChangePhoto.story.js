<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { action } from '@storybook/addon-actions'

import ChangePhoto from './ChangePhoto'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import logo from '@/../public/statics/carrot_logo.png'

const on = {
  onSave: action('save'),
}

storiesOf('ChangePhoto', module)
  .add('with photo', () => defaults({
    render: () => h(ChangePhoto, {
      value: {
        photoUrls: {
          fullSize: logo,
        },
      },
      helper: 'Helper',
      label: 'Label',
      status: statusMocks.default(),
      ...on,
    }),
  }))
  .add('empty', () => defaults({
    render: () => h(ChangePhoto, {
      status: statusMocks.default(),
      ...on,
    }),
  }))
  .add('pending', () => defaults({
    render: () => h(ChangePhoto, {
      status: statusMocks.pending(),
      ...on,
    }),
  }))
  .add('error', () => defaults({
    render: () => h(ChangePhoto, {
      status: statusMocks.validationError('photo', 'something is wrong'),
      ...on,
    }),
  }))
