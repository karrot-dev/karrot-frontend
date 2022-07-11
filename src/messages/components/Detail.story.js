<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

import DetailHeader from './DetailHeaderUI'
import DetailUI from './DetailUI'

const detailStory = props => defaults({
  store: createDatastore({
    users: {
      getters: {
        byCurrentGroup: () => [],
      },
    },
  }),
  render: () => h('div', [
    h(DetailHeader, props),
    h(DetailUI, props),
  ]),
})

const conversation = factories.makeConversation({
  participants: [
    factories.makeUser(),
    factories.makeUser(),
    factories.makeUser(),
  ],
})
const application = factories.makeApplication()
const activity = factories.makeActivity({
  isDisabled: true,
})
const user = factories.makeUser()

const currentUser = factories.makeCurrentUser()

storiesOf('Detail', module)
  .add('application', () => detailStory({
    conversation,
    application,
    currentUser,
  }))
  .add('activity', () => detailStory({
    conversation,
    activity,
    currentUser,
  }))
  .add('private', () => detailStory({
    conversation,
    user,
    currentUser,
  }))
