import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupGalleryCard from './GroupGalleryCard'

import { groupsMock } from '>/mockdata'

const methods = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupGalleryCard', module)
  .add('isMember = true', () => defaults({
    components: { GroupGalleryCard },
    template: '<GroupGalleryCard :group="group" :isMember="true" @visit="visit" @preview="preview" />',
    data () { return { group: groupsMock[0] } },
    methods,
  }))
  .add('isMember = false', () => defaults({
    components: { GroupGalleryCard },
    template: '<GroupGalleryCard :group="group" :isMember="false" @preview="preview" />',
    data () { return { group: groupsMock[0] } },
    methods,
  }))
  .add('without public description', () => defaults({
    components: { GroupGalleryCard },
    template: '<GroupGalleryCard :group="group" :isMember="false" @preview="preview" />',
    data () {
      return {
        group: { ...groupsMock[0], publicDescription: '' },
      }
    },
    methods,
  }))
