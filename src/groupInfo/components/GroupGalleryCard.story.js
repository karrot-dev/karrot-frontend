import { h } from 'vue'
import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupGalleryCard from './GroupGalleryCard'

import { makeGroupInfo } from '>/enrichedFactories'

const methods = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupGalleryCard', module)
  .add('isMember = true', () => defaults({
    render: () => h(GroupGalleryCard, {
      props: {
        group: makeGroupInfo({ isMember: true }),
      },
      on: methods,
    }),
  }))
  .add('isMember = false', () => defaults({
    render: () => h(GroupGalleryCard, {
      props: {
        group: makeGroupInfo(),
      },
      on: methods,
    }),
  }))
  .add('isMember = false, application pending', () => defaults({
    render: () => h(GroupGalleryCard, {
      props: {
        group: makeGroupInfo({ myApplicationPending: true }),
      },
      on: methods,
    }),
  }))
  .add('without public description', () => defaults({
    render: () => h(GroupGalleryCard, {
      props: {
        group: makeGroupInfo({ publicDescription: '' }),
      },
      on: methods,
    }),
  }))
