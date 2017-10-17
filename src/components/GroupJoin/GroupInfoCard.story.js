import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupInfoCard from './GroupInfoCard.vue'
import i18n from '@/i18n'

import { groupsMock } from '>/mockdata'

const methods = {
  join: action('join group'),
  visit: action('visit group'),
}

storiesOf('GroupInfoCard', module)
  .add('is not member', () => ({
    components: { GroupInfoCard },
    template: '<GroupInfoCard :group="group" @join="join" />',
    data () { return { group: { ...groupsMock[0], isMember: false } } },
    methods,
    i18n,
  }))
  .add('is member', () => ({
    components: { GroupInfoCard },
    template: '<GroupInfoCard :group="group" @visit="visit" />',
    data () { return { group: { ...groupsMock[0], isMember: true } } },
    methods,
    i18n,
  }))
  .add('without public description', () => ({
    components: { GroupInfoCard },
    template: '<GroupInfoCard :group="group" />',
    data () {
      return {
        group: { ...groupsMock[0], publicDescription: '', isMember: true },
      }
    },
    i18n,
  }))
