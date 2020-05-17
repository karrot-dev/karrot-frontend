import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupGalleryCard from './GroupGalleryCard'
import * as factories from '>/enrichedFactories'

import { groupsMock } from '>/mockdata'

const datastore = createDatastore({
  applications: {
    getters: {
      getMineInGroup: () => () => null,
    },
  },
})

const application = factories.makeApplication()
const myApplicationDatastore = createDatastore({
  applications: {
    getters: {
      getMineInGroup: () => () => application,
    },
  },
})

const methods = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupGalleryCard', module)
  .add('isMember = true', () => defaults({
    render: h => h(GroupGalleryCard, {
      props: {
        group: {
          ...groupsMock[0],
          isMember: true,
        },
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('isMember = false', () => defaults({
    render: h => h(GroupGalleryCard, {
      props: {
        group: {
          ...groupsMock[0],
          isMember: false,
        },
      },
      on: methods,
    }),
    store: datastore,
  }))
  .add('isMember = false, application pending', () => defaults({
    render: h => h(GroupGalleryCard, {
      props: {
        group: {
          ...groupsMock[0],
          isMember: false,
        },
      },
      on: methods,
    }),
    store: myApplicationDatastore,
  }))
  .add('without public description', () => defaults({
    render: h => h(GroupGalleryCard, {
      props: {
        group: {
          ...groupsMock[0],
          publicDescription: '',
          isMember: false,
        },
      },
      on: methods,
    }),
    store: datastore,
  }))
