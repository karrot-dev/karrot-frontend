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
const pickup = factories.makePickup({
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
  .add('pickup', () => detailStory({
    conversation,
    pickup,
    currentUser,
  }))
  .add('private', () => detailStory({
    conversation,
    user,
    currentUser,
  }))
