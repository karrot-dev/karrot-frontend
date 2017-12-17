import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupGallery from './GroupGalleryUI'
import i18n from '@/i18n'
import router from '@/router'
import { groupsMock } from '>/mockdata'

const defaultOn = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupGallery', module)
  .add('signup view', () => ({
    render: h => h(GroupGallery, {
      props: {
        otherGroups: groupsMock,
      },
      on: defaultOn,
    }),
    i18n,
    router,
  }))
  .add('switch and explore', () => ({
    render: h => h(GroupGallery, {
      props: {
        myGroups: groupsMock.slice(0, 3),
        otherGroups: groupsMock,
      },
      on: defaultOn,
    }),
    i18n,
    router,
  }))
