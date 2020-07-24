import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

import DetailHeader from './DetailHeaderUI'
import DetailUI from './DetailUI'

const detailStory = props => defaults({
  render: h => h('div', [
    h(DetailHeader, { props }),
    h(DetailUI, { props }),
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
