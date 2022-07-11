<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

import CommunityFeed from './CommunityFeed'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

const range = n => [...Array(n).keys()]

let topicId = 0
const makeTopic = () => ({
  id: topicId++,
  link: '',
  isUnread: true,
  lastPosterAvatar: 'https://avatars3.githubusercontent.com/u/4410802?v=4',
  lastPosterUsername: 'tiltec',
  title: 'asdf',
  lastPostedAt: new Date(),
})

const topics = range(5).map(makeTopic)

storiesOf('CommunityFeed', module)
  .add('CommunityFeed', () => defaults({
    render: () => h(CommunityFeed),
    store: createDatastore({
      communityFeed: {
        getters: {
          unreadCount: () => 5,
          topics: () => topics,
        },
      },
    }),
  }))
