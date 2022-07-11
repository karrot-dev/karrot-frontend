<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

import WallConversation from './WallConversation'
import { currentUserMock } from '>/mockdata'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const conversation = factories.makeConversation()

const store = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

const defaultProps = (data) => ({
  data: conversation,
  user: currentUserMock,
  fetchPast: () => {},
  ...data,
})

storiesOf('WallConversation', module)
  .add('default', () => defaults({
    store,
    render: () => h(WallConversation, defaultProps()),
  }))
  .add('unread', () => defaults({
    store,
    render: () => h(WallConversation, defaultProps({
      data: {
        ...conversation,
        unreadMessageCount: 1,
        isParticipant: true,
      },
    })),
  }))
