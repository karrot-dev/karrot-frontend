// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupGalleryCard from './GroupGalleryCard'

import { makeGroupInfo } from '>/enrichedFactories'

const methods = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupGalleryCard', module)
  .add('isMember = true', () => defaults({
    render: h => h(GroupGalleryCard, {
      props: {
        group: makeGroupInfo({ isMember: true }),
      },
      on: methods,
    }),
  }))
  .add('isMember = false', () => defaults({
    render: h => h(GroupGalleryCard, {
      props: {
        group: makeGroupInfo(),
      },
      on: methods,
    }),
  }))
  .add('isMember = false, application pending', () => defaults({
    render: h => h(GroupGalleryCard, {
      props: {
        group: makeGroupInfo({ myApplicationPending: true }),
      },
      on: methods,
    }),
  }))
  .add('without public description', () => defaults({
    render: h => h(GroupGalleryCard, {
      props: {
        group: makeGroupInfo({ publicDescription: '' }),
      },
      on: methods,
    }),
  }))
