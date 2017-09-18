import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupInfoCard from './GroupInfoCard.vue'
import i18n from '@/i18n'

import { groupsMock } from '@/components/mockdata'

const methods = {
  join: action('join group'),
  visit: action('visit group'),
}

storiesOf('GroupInfoCard', module)
  .add('joinable', () => ({
    components: { GroupInfoCard },
    template: '<GroupInfoCard :group="group" joinable="true" @join="join" />',
    data () { return { group: groupsMock[0] } },
    methods,
    i18n,
  }))
  .add('visitable', () => ({
    components: { GroupInfoCard },
    template: '<GroupInfoCard :group="group" visitable="true" @visit="visit" />',
    data () { return { group: groupsMock[0] } },
    methods,
    i18n,
  }))
  .add('without public description', () => ({
    components: { GroupInfoCard },
    template: '<GroupInfoCard :group="group" />',
    data () {
      return {
        group: { ...groupsMock[0], publicDescription: '' },
      }
    },
    i18n,
  }))
