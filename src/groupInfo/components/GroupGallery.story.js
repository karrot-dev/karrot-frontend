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

import GroupGallery from './GroupGalleryUI'
import { makeGroupInfo } from '>/enrichedFactories'

const groups = [
  makeGroupInfo({ memberCount: 20 }),
  makeGroupInfo({ memberCount: 40 }),
  makeGroupInfo({ memberCount: 60 }),
]

const defaultOn = {
  onPreview: action('view group preview'),
  onVisit: action('visit group'),
}

storiesOf('GroupGallery', module)
  .add('signup view', () => defaults({
    render: () => h(GroupGallery, {
      otherGroups: groups,
      ...defaultOn,
    }),
  }))
  .add('switch and explore', () => defaults({
    render: () => h(GroupGallery, {
      myGroups: [
        makeGroupInfo({ isMember: true }),
        makeGroupInfo({ isMember: true }),
      ],
      otherGroups: groups,
      isLoggedIn: true,
      ...defaultOn,
    }),
  }))
