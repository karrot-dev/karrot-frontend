<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

=======
import { h } from 'vue'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'

import GroupGalleryCard from './GroupGalleryCard'

import { makeGroupInfo } from '>/enrichedFactories'

const on = {
  onPreview: action('view group preview'),
  onVisit: action('visit group'),
}

storiesOf('GroupGalleryCard', module)
  .add('isMember = true', () => defaults({
    render: () => h(GroupGalleryCard, {
      group: makeGroupInfo({ isMember: true }),
      ...on,
    }),
  }))
  .add('isMember = false', () => defaults({
    render: () => h(GroupGalleryCard, {
      group: makeGroupInfo(),
      ...on,
    }),
  }))
  .add('isMember = false, application pending', () => defaults({
    render: () => h(GroupGalleryCard, {
      group: makeGroupInfo({ myApplicationPending: true }),
      ...on,
    }),
  }))
  .add('without public description', () => defaults({
    render: () => h(GroupGalleryCard, {
      group: makeGroupInfo({ publicDescription: '' }),
      ...on,
    }),
  }))
