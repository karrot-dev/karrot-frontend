import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

import DetailUI from './DetailUI'

const conversation = factories.makeConversation({
  participants: [
    factories.makeUser(),
    factories.makeUser(),
    factories.makeUser(),
  ],
})

const conflict = factories.makeConflict()
const application = factories.makeApplication()

storiesOf('Detail', module)
  .add('conflict', () => defaults({
    render: h => h(DetailUI, {
      props: {
        conflict,
        conversation,
      },
    }),
  }))

  .add('application', () => defaults({
    render: h => h(DetailUI, {
      props: {
        application,
        conversation,
      },
    }),
  }))
