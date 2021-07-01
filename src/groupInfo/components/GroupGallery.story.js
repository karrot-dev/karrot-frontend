import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupGallery from './GroupGalleryUI'
import { makeGroupInfo } from '>/enrichedFactories'

const groups = [
  makeGroupInfo({ memberCount: 20 }),
  makeGroupInfo({ memberCount: 40 }),
  makeGroupInfo({ memberCount: 60 }),
]

const defaultOn = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupGallery', module)
  .add('signup view', () => defaults({
    render: h => h(GroupGallery, {
      props: {
        otherGroups: groups,
      },
      on: defaultOn,
    }),
  }))
  .add('switch and explore', () => defaults({
    render: h => h(GroupGallery, {
      props: {
        myGroups: [
          makeGroupInfo({ isMember: true }),
          makeGroupInfo({ isMember: true }),
        ],
        otherGroups: groups,
        isLoggedIn: true,
      },
      on: defaultOn,
    }),
  }))
