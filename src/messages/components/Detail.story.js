import { storiesOf } from '@storybook/vue'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { currentUserMock } from '>/mockdata'

import DetailUI from './DetailUI'

const application = {
  id: 87,
  createdAt: '2019-01-15T14:52:16.965Z',
  questions: 'What do you want with us?!',
  user: {
    displayName: 'Salamander',
    id: 456,
  },
  group: {
    name: 'Reptile saving',
    id: 675,
  },
  answers: 'I can live off fire!',
}

const conflict = {
  affectedUser: {
    id: 174,
    displayName: 'Amara Sails',
  },
  createdAt: '2019-01-15T13:56:24.556407Z',
  createdBy: {
    id: 173,
    displayName: 'Luisa Lant',
  },
  group: {
    id: 36,
    displayName: 'Gothenburg FoodShaving Inc.',
  },
  id: 35,
  isDecided: false,
  topic: 'I complain about this user',
  type: 'conflict_resolution',
}

const conversation = {
  id: 34,
  participants: [ 222, 12, 2, 87, 123 ],
  updatedAt: '2019-01-16T11:50:04.912Z',
  seenUpTo: null,
  unreadMessageCount: 1,
  emailNotification: true,
  target: application,
  answers: 'I can live off fire',
  fetchStatus: {
    isPending: false,
  },
  messages: [
    {
      id: 1489,
      author: {
        id: 444,
        displayName: 'Thomas Tipi',
      },
      content: '> gvgff',
      conversation: 2,
      createdAt: '2019-01-13T10:51:03.745353Z',
      updatedAt: '2019-01-13T10:51:28.537544Z',
      editedAt: '2019-01-13T10:51:28.537359Z',
      reactions: [],
      receivedVia: '',
      isEditable: false,
      thread: null,
      threadMeta: null,
    },
    {
      id: 1487,
      author: {
        id: 22,
        displayName: 'Margharita Molla',
      },
      content: 'So glad that this displays! Even if all red!',
      conversation: 2576,
      createdAt: '2019-01-13T10:39:34.244037Z',
      updatedAt: '2019-01-13T10:39:34.244494Z',
      editedAt: null,
      reactions: [],
      receivedVia: '',
      isEditable: false,
      thread: null,
      threadMeta: null,
    },
  ],
}

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
        application,
        conversation,
      },
    }),
    store: datastore,
  }))

  .add('conflict', () => defaults({
    render: h => h(DetailUI, {
      props: {
        conflict,
        conversation,
      },
    }),
  }))
