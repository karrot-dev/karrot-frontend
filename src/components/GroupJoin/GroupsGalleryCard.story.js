import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupsGalleryCard from './GroupsGalleryCard'
import i18n from '@/i18n'

import { groupsMock } from '>/mockdata'

const methods = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupsGalleryCard', module)
  .add('isMember = true', () => ({
    components: { GroupsGalleryCard },
    template: '<GroupsGalleryCard :group="group" :isMember="true" @visit="visit" @preview="preview" />',
    data () { return { group: groupsMock[0] } },
    methods,
    i18n,
  }))
  .add('isMember = false', () => ({
    components: { GroupsGalleryCard },
    template: '<GroupsGalleryCard :group="group" :isMember="false" @preview="preview" />',
    data () { return { group: groupsMock[0] } },
    methods,
    i18n,
  }))
  .add('without public description', () => ({
    components: { GroupsGalleryCard },
    template: '<GroupsGalleryCard :group="group" :isMember="false" @preview="preview" />',
    data () {
      return {
        group: { ...groupsMock[0], publicDescription: '' },
      }
    },
    methods,
    i18n,
  }))
