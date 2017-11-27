import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupGalleryCard from './GroupGalleryCard'
import i18n from '@/i18n'

import { groupsMock } from '>/mockdata'

const methods = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupGalleryCard', module)
  .add('isMember = true', () => ({
    components: { GroupGalleryCard },
    template: '<GroupGalleryCard :group="group" :isMember="true" @visit="visit" @preview="preview" />',
    data () { return { group: groupsMock[0] } },
    methods,
    i18n,
  }))
  .add('isMember = false', () => ({
    components: { GroupGalleryCard },
    template: '<GroupGalleryCard :group="group" :isMember="false" @preview="preview" />',
    data () { return { group: groupsMock[0] } },
    methods,
    i18n,
  }))
  .add('without public description', () => ({
    components: { GroupGalleryCard },
    template: '<GroupGalleryCard :group="group" :isMember="false" @preview="preview" />',
    data () {
      return {
        group: { ...groupsMock[0], publicDescription: '' },
      }
    },
    methods,
    i18n,
  }))
