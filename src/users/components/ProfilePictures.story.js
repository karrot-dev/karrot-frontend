// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import ProfilePicture from './ProfilePicture'
import { usersMock } from '>/mockdata'

storiesOf('ProfilePicture', module)
  .add('with user', () => defaults({
    render: h => h(ProfilePicture, {
      props: {
        user: usersMock[0],
        isLink: false,
        size: 100,
      },
    }),
  }))
  .add('without user', () => defaults({
    render: h => h(ProfilePicture, {
      props: {
        user: {
          id: 1,
          displayName: '?',
        },
        size: 100,
      },
    }),
  }))
