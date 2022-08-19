import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { makeGroupInfo } from '>/enrichedFactories'
import { storybookDefaults as defaults } from '>/helpers'

import GroupGalleryCard from './GroupGalleryCard'

const on = {
  onPreview: action('view group preview'),
  onVisit: action('visit group'),
}

storiesOf('GroupGalleryCard', module)
  .add('isMember = true', () => defaults({
    render: () => h(GroupGalleryCard, {
      group: makeGroupInfo({ isMember: true }),
      ...on,
    }),
  }))
  .add('isMember = false', () => defaults({
    render: () => h(GroupGalleryCard, {
      group: makeGroupInfo(),
      ...on,
    }),
  }))
  .add('isMember = false, application pending', () => defaults({
    render: () => h(GroupGalleryCard, {
      group: makeGroupInfo({ myApplicationPending: true }),
      ...on,
    }),
  }))
  .add('without public description', () => defaults({
    render: () => h(GroupGalleryCard, {
      group: makeGroupInfo({ publicDescription: '' }),
      ...on,
    }),
  }))
