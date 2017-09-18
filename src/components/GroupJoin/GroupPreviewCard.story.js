import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupPreviewCard from './GroupPreviewCard.vue'
import i18n from '@/i18n'

import { groupsMock } from '@/components/mockdata'

const methods = {
  viewMore: action('view more group info'),
  visit: action('visit group'),
}

storiesOf('GroupPreviewCard', module)
  .add('isMember = true', () => ({
    components: { GroupPreviewCard },
    template: '<GroupPreviewCard :group="group" isMember="true" />',
    data () { return { group: groupsMock[0] } },
    methods,
    i18n,
  }))
  .add('isMember = false', () => ({
    components: { GroupPreviewCard },
    template: '<GroupPreviewCard :group="group" isMember="false" />',
    data () { return { group: groupsMock[0] } },
    methods,
    i18n,
  }))
  .add('without public description', () => ({
    components: { GroupPreviewCard },
    template: '<GroupPreviewCard :group="group" isMember="false" />',
    data () {
      return {
        group: { ...groupsMock[0], publicDescription: '' },
      }
    },
    methods,
    i18n,
  }))
