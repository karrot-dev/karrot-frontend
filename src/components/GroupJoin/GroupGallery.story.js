import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupGallery from './GroupGalleryUI'
import { groupsMock } from '>/mockdata'

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
  }))
  .add('switch and explore', () => defaults({
    render: h => h(GroupGallery, {
      props: {
        myGroups: groupsMock.slice(0, 3),
        otherGroups: groupsMock,
      },
      on: defaultOn,
    }),
  }))
