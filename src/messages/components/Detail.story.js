import { storiesOf } from '@storybook/vue'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { conversationMock, currentUserMock, applicationMock } from '>/mockdata'

import DetailUI from './DetailUI'

const datastore = createDatastore({
  auth: {
    getters: {
      user: () => currentUserMock,
    },
  },
})

storiesOf('Detail', module)
  .add('application', () => defaults({
    render: h => h(DetailUI, {
      props: {
        application: applicationMock[0],
        conversation: conversationMock[0],
      },
    }),
    data () {
      return {
        isPending: true,
      }
    },
    store: datastore,
  }))
