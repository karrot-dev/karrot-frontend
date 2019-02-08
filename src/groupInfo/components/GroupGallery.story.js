import { createDatastore, storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupGallery from './GroupGalleryUI'
import { groupsMock } from '>/mockdata'

const datastore = createDatastore({
  applications: {
    getters: {
      getMineInGroup: () => () => null,
    },
  },
})

const defaultOn = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupGallery', module)
  .add('signup view', () => defaults({
    render: h => h(GroupGallery, {
      props: {
        otherGroups: groupsMock,
      },
      on: defaultOn,
    }),
    store: datastore,
  }))
  .add('switch and explore', () => defaults({
    render: h => h(GroupGallery, {
      props: {
        myGroups: groupsMock.slice(0, 3).map(g => ({ ...g, id: g.id * 10, isMember: true })),
        otherGroups: groupsMock,
      },
      on: defaultOn,
    }),
    store: datastore,
  }))
