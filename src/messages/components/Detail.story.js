import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import * as factories from '>/enrichedFactories'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

import DetailHeader from './DetailHeaderUI.vue'
import DetailUI from './DetailUI.vue'

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
